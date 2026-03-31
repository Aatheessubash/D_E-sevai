import http from "./http";

export const notificationApi = {
  getNotifications: () => http.get("/notifications"),
  markRead: (id) => http.patch(`/notifications/${id}/read`),
  markAllRead: () => http.patch("/notifications/read-all"),
};
