import mongoose from "mongoose";
import { REQUEST_STATUSES, VERIFICATION_STATES } from "../constants/statuses.js";

const requestedDocumentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    requestedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

const uploadedDocumentSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

const fileSchema = new mongoose.Schema(
  {
    originalName: String,
    filePath: String,
    mimeType: String,
    size: Number,
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

const timelineSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      trim: true,
    },
    actorRole: {
      type: String,
      enum: ["user", "admin", "system"],
      default: "system",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

const serviceRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    serviceName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: REQUEST_STATUSES,
      default: "Pending Request",
    },
    verificationState: {
      type: String,
      enum: VERIFICATION_STATES,
      default: "Pending",
    },
    requestedDocuments: {
      type: [requestedDocumentSchema],
      default: [],
    },
    uploadedDocuments: {
      type: [uploadedDocumentSchema],
      default: [],
    },
    adminNotes: {
      type: String,
      trim: true,
      default: "",
    },
    completedFile: {
      type: fileSchema,
      default: null,
    },
    timeline: {
      type: [timelineSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const ServiceRequest = mongoose.model("ServiceRequest", serviceRequestSchema);

export default ServiceRequest;
