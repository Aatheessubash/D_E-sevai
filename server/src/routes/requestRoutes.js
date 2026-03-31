import express from "express";
import {
  createRequest,
  getMyRequests,
  getRequestById,
  getServiceCatalog,
  uploadRequestedDocuments,
} from "../controllers/requestController.js";
import { protect } from "../middleware/authMiddleware.js";
import { documentUpload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/services", getServiceCatalog);
router.use(protect);
router.post("/", createRequest);
router.get("/my", getMyRequests);
router.get("/:id", getRequestById);
router.post("/:id/documents", documentUpload.array("documents", 10), uploadRequestedDocuments);

export default router;
