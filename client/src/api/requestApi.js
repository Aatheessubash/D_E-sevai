import http from "./http";

export const requestApi = {
  getServices: () => http.get("/requests/services"),
  createRequest: (payload) => http.post("/requests", payload),
  getMyRequests: () => http.get("/requests/my"),
  getRequestById: (id) => http.get(`/requests/${id}`),
  uploadDocuments: (id, formData) =>
    http.post(`/requests/${id}/documents`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};
