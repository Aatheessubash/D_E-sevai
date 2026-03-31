import ServiceRequest from "../models/ServiceRequest.js";
import User from "../models/User.js";
import { REQUEST_STATUSES } from "../constants/statuses.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { notifyUser } from "../services/notificationService.js";
import { sendEmailNotification } from "../services/emailService.js";

const toRelativePath = (absolutePath) => {
  const normalizedPath = absolutePath.replace(/\\/g, "/");
  const marker = "/uploads/";
  const markerIndex = normalizedPath.indexOf(marker);
  return markerIndex >= 0 ? normalizedPath.slice(markerIndex) : normalizedPath;
};

const customerUpdateEmail = (serviceRequest, status, note) => ({
  subject: `Update on your ${serviceRequest.serviceName} request`,
  text: `Your ${serviceRequest.serviceName} request is now marked as ${status}.${note ? ` Notes: ${note}` : ""}`,
  html: `<p>Your <strong>${serviceRequest.serviceName}</strong> request is now marked as <strong>${status}</strong>.</p>${
    note ? `<p>Admin note: ${note}</p>` : ""
  }`,
});

export const getAllRequests = asyncHandler(async (req, res) => {
  const { status, search } = req.query;
  const query = {};

  if (status) {
    query.status = status;
  }

  if (search) {
    const userIds = await User.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    }).select("_id");

    query.$or = [
      { serviceName: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { userId: { $in: userIds.map((user) => user._id) } },
    ];
  }

  const requests = await ServiceRequest.find(query)
    .populate("userId", "name email phone")
    .sort({ createdAt: -1 });

  res.json({ requests });
});

export const getRequestDetail = asyncHandler(async (req, res) => {
  const serviceRequest = await ServiceRequest.findById(req.params.id).populate("userId", "name email phone role");

  if (!serviceRequest) {
    res.status(404);
    throw new Error("Service request not found.");
  }

  res.json({ request: serviceRequest });
});

export const updateRequestStatus = asyncHandler(async (req, res) => {
  const { status, adminNotes = "", verificationState } = req.body;
  const serviceRequest = await ServiceRequest.findById(req.params.id).populate("userId", "name email");

  if (!serviceRequest) {
    res.status(404);
    throw new Error("Service request not found.");
  }

  if (!status || !REQUEST_STATUSES.includes(status)) {
    res.status(400);
    throw new Error("Please choose a valid status.");
  }

  if (status === "Completed" && !serviceRequest.completedFile) {
    res.status(400);
    throw new Error("Upload the final completed document before marking this request as completed.");
  }

  serviceRequest.status = status;
  serviceRequest.adminNotes = adminNotes;

  if (verificationState) {
    serviceRequest.verificationState = verificationState;
  } else if (status === "Rejected") {
    serviceRequest.verificationState = "Rejected";
  } else if (status === "Under Review") {
    serviceRequest.verificationState = "Approved";
  }

  serviceRequest.timeline.push({
    status,
    note: adminNotes || `Admin changed the request status to ${status}.`,
    actorRole: "admin",
  });

  await serviceRequest.save();

  await notifyUser({
    userId: serviceRequest.userId._id,
    title: `Request updated: ${status}`,
    message: `Your ${serviceRequest.serviceName} request is now ${status}.`,
    metadata: { requestId: serviceRequest._id },
  });

  await sendEmailNotification({
    to: serviceRequest.userId.email,
    ...customerUpdateEmail(serviceRequest, status, adminNotes),
  });

  res.json({ request: serviceRequest });
});

export const requestDocuments = asyncHandler(async (req, res) => {
  const { requestedDocuments, adminNotes = "" } = req.body;
  const serviceRequest = await ServiceRequest.findById(req.params.id).populate("userId", "name email");

  if (!serviceRequest) {
    res.status(404);
    throw new Error("Service request not found.");
  }

  const normalizedDocuments = Array.isArray(requestedDocuments)
    ? requestedDocuments.map((document) => String(document).trim()).filter(Boolean)
    : [];

  if (!normalizedDocuments.length) {
    res.status(400);
    throw new Error("Please provide at least one requested document.");
  }

  serviceRequest.requestedDocuments = normalizedDocuments.map((name) => ({ name }));
  serviceRequest.status = "Documents Required";
  serviceRequest.adminNotes = adminNotes;
  serviceRequest.timeline.push({
    status: "Documents Required",
    note: adminNotes || "Admin requested supporting documents.",
    actorRole: "admin",
  });

  await serviceRequest.save();

  await notifyUser({
    userId: serviceRequest.userId._id,
    title: "Documents requested",
    message: `Please upload ${normalizedDocuments.join(", ")} for your ${serviceRequest.serviceName} request.`,
    metadata: { requestId: serviceRequest._id },
  });

  await sendEmailNotification({
    to: serviceRequest.userId.email,
    subject: `Documents needed for ${serviceRequest.serviceName}`,
    text: `Please upload the following documents: ${normalizedDocuments.join(", ")}.${adminNotes ? ` Notes: ${adminNotes}` : ""}`,
    html: `<p>Please upload the following documents for your <strong>${serviceRequest.serviceName}</strong> request:</p><ul>${normalizedDocuments
      .map((document) => `<li>${document}</li>`)
      .join("")}</ul>${adminNotes ? `<p>Admin note: ${adminNotes}</p>` : ""}`,
  });

  res.json({ request: serviceRequest });
});

export const uploadFinalDocument = asyncHandler(async (req, res) => {
  const { adminNotes = "" } = req.body;
  const serviceRequest = await ServiceRequest.findById(req.params.id).populate("userId", "name email");

  if (!serviceRequest) {
    res.status(404);
    throw new Error("Service request not found.");
  }

  if (!req.file) {
    res.status(400);
    throw new Error("Please upload the completed document.");
  }

  serviceRequest.completedFile = {
    originalName: req.file.originalname,
    filePath: toRelativePath(req.file.path),
    mimeType: req.file.mimetype,
    size: req.file.size,
  };
  serviceRequest.status = "Completed";
  serviceRequest.verificationState = "Approved";
  serviceRequest.adminNotes = adminNotes;
  serviceRequest.timeline.push({
    status: "Completed",
    note: adminNotes || "Final certificate uploaded and request completed.",
    actorRole: "admin",
  });

  await serviceRequest.save();

  await notifyUser({
    userId: serviceRequest.userId._id,
    title: "Completed document ready",
    message: `Your ${serviceRequest.serviceName} certificate is ready to download.`,
    metadata: { requestId: serviceRequest._id },
  });

  await sendEmailNotification({
    to: serviceRequest.userId.email,
    subject: `${serviceRequest.serviceName} completed`,
    text: `Your completed ${serviceRequest.serviceName} document is ready for download.`,
    html: `<p>Your <strong>${serviceRequest.serviceName}</strong> document is ready for download from the Digital e-Sevai Service Portal.</p>`,
  });

  res.json({ request: serviceRequest });
});

export const getAnalytics = asyncHandler(async (req, res) => {
  const totalRequests = await ServiceRequest.countDocuments();
  const completedRequests = await ServiceRequest.countDocuments({ status: "Completed" });
  const statusBuckets = await ServiceRequest.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  const serviceBuckets = await ServiceRequest.aggregate([
    { $group: { _id: "$serviceName", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 6 },
  ]);

  const recentRequests = await ServiceRequest.find()
    .populate("userId", "name")
    .sort({ createdAt: -1 })
    .limit(5)
    .select("serviceName status createdAt userId");

  res.json({
    analytics: {
      totalRequests,
      completedRequests,
      completionRate: totalRequests ? Math.round((completedRequests / totalRequests) * 100) : 0,
      pendingActions: await ServiceRequest.countDocuments({
        status: { $in: ["Pending Request", "Documents Submitted", "Under Review"] },
      }),
      statusBuckets,
      serviceBuckets,
      recentRequests,
    },
  });
});
