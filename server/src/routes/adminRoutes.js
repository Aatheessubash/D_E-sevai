import express from "express";
import {
  getAllRequests,
  getAnalytics,
  getRequestDetail,
  requestDocuments,
  updateRequestStatus,
  uploadFinalDocument,
} from "../controllers/adminController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import { finalDocumentUpload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.use(protect, adminOnly);
router.get("/requests", getAllRequests);
router.get("/requests/:id", getRequestDetail);
router.patch("/requests/:id/status", updateRequestStatus);
router.patch("/requests/:id/request-documents", requestDocuments);
router.post("/requests/:id/final-document", finalDocumentUpload.single("completedFile"), uploadFinalDocument);
router.get("/analytics", getAnalytics);

export default router;
