import http from "./http";

export const adminApi = {
  getRequests: (params) => http.get("/admin/requests", { params }),
  getRequestById: (id) => http.get(`/admin/requests/${id}`),
  requestDocuments: (id, payload) => http.patch(`/admin/requests/${id}/request-documents`, payload),
  updateStatus: (id, payload) => http.patch(`/admin/requests/${id}/status`, payload),
  uploadFinalDocument: (id, formData) =>
    http.post(`/admin/requests/${id}/final-document`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  getAnalytics: () => http.get("/admin/analytics"),
};
