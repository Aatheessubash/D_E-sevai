import { SERVER_BASE_URL } from "../api/http";

export const getFileUrl = (filePath) => {
  if (!filePath) {
    return "";
  }

  if (filePath.startsWith("http")) {
    return filePath;
  }

  return `${SERVER_BASE_URL}${filePath}`;
};

export const isPreviewableImage = (mimeType) => mimeType?.startsWith("image/");

export const isPdf = (mimeType) => mimeType === "application/pdf";
