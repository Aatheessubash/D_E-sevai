import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsRoot = path.resolve(__dirname, "../../uploads");

const allowedMimeTypes = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const sanitizeName = (fileName) => {
  const extension = path.extname(fileName);
  const baseName = path.basename(fileName, extension).replace(/[^a-zA-Z0-9-_]/g, "-");
  return `${baseName.slice(0, 60) || "file"}${extension}`;
};

const createStorage = (folderResolver) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const targetDirectory = folderResolver(req);
      fs.mkdirSync(targetDirectory, { recursive: true });
      cb(null, targetDirectory);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}-${sanitizeName(file.originalname)}`);
    },
  });

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.has(file.mimetype)) {
    cb(null, true);
    return;
  }

  cb(new Error("Unsupported file type. Please upload PDF, image, or Word documents."));
};

const createUploader = (folderResolver) =>
  multer({
    storage: createStorage(folderResolver),
    fileFilter,
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
  });

export const documentUpload = createUploader((req) =>
  path.join(uploadsRoot, "requests", req.params.id, "documents"),
);

export const finalDocumentUpload = createUploader((req) =>
  path.join(uploadsRoot, "requests", req.params.id, "final"),
);
