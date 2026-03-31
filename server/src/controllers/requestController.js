import { AVAILABLE_SERVICES } from "../constants/services.js";
import ServiceRequest from "../models/ServiceRequest.js";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { notifyAdmins } from "../services/notificationService.js";

const toRelativePath = (absolutePath) => {
  const normalizedPath = absolutePath.replace(/\\/g, "/");
  const marker = "/uploads/";
  const markerIndex = normalizedPath.indexOf(marker);
  return markerIndex >= 0 ? normalizedPath.slice(markerIndex) : normalizedPath;
};

const parseDocumentLabels = (rawValue) => {
  if (!rawValue) {
    return [];
  }

  if (Array.isArray(rawValue)) {
    return rawValue;
  }

  try {
    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed) ? parsed : [String(parsed)];
  } catch (error) {
    return String(rawValue)
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
};

export const getServiceCatalog = asyncHandler(async (req, res) => {
  res.json({ services: AVAILABLE_SERVICES });
});

export const createRequest = asyncHandler(async (req, res) => {
  const { serviceName, description } = req.body;

  if (!serviceName || !description) {
    res.status(400);
    throw new Error("Service name and description are required.");
  }

  const serviceRequest = await ServiceRequest.create({
    userId: req.user._id,
    serviceName,
    description,
    status: "Pending Request",
    timeline: [
      {
        status: "Pending Request",
        note: "Service request submitted by customer.",
        actorRole: "user",
      },
    ],
  });

  await notifyAdmins({
    title: "New service request received",
    message: `${req.user.name} submitted a ${serviceName} request.`,
    metadata: { requestId: serviceRequest._id },
  });

  res.status(201).json({ request: serviceRequest });
});

export const getMyRequests = asyncHandler(async (req, res) => {
  const requests = await ServiceRequest.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json({ requests });
});

export const getRequestById = asyncHandler(async (req, res) => {
  const serviceRequest = await ServiceRequest.findById(req.params.id).populate("userId", "name email phone role");

  if (!serviceRequest) {
    res.status(404);
    throw new Error("Service request not found.");
  }

  if (req.user.role !== "admin" && String(serviceRequest.userId._id) !== String(req.user._id)) {
    res.status(403);
    throw new Error("You do not have access to this request.");
  }

  res.json({ request: serviceRequest });
});

export const uploadRequestedDocuments = asyncHandler(async (req, res) => {
  const serviceRequest = await ServiceRequest.findById(req.params.id);

  if (!serviceRequest) {
    res.status(404);
    throw new Error("Service request not found.");
  }

  if (String(serviceRequest.userId) !== String(req.user._id)) {
    res.status(403);
    throw new Error("You can only upload documents for your own request.");
  }

  if (!req.files?.length) {
    res.status(400);
    throw new Error("Please upload at least one document.");
  }

  const labels = parseDocumentLabels(req.body.documentLabels);
  const uploadedDocuments = req.files.map((file, index) => ({
    label: labels[index] || serviceRequest.requestedDocuments[index]?.name || `Document ${serviceRequest.uploadedDocuments.length + index + 1}`,
    originalName: file.originalname,
    filePath: toRelativePath(file.path),
    mimeType: file.mimetype,
    size: file.size,
  }));

  serviceRequest.uploadedDocuments.push(...uploadedDocuments);
  serviceRequest.status = "Documents Submitted";
  serviceRequest.timeline.push({
    status: "Documents Submitted",
    note: `${uploadedDocuments.length} document(s) uploaded by customer.`,
    actorRole: "user",
  });

  await serviceRequest.save();

  const customer = await User.findById(req.user._id).select("name");

  await notifyAdmins({
    title: "Documents submitted",
    message: `${customer?.name || "Customer"} uploaded documents for ${serviceRequest.serviceName}.`,
    metadata: { requestId: serviceRequest._id },
  });

  res.json({ request: serviceRequest });
});
