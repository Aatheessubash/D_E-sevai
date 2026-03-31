import http from "./http";

export const authApi = {
  register: (payload) => http.post("/auth/register", payload),
  login: (payload) => http.post("/auth/login", payload),
  me: () => http.get("/auth/me"),
  changePassword: (payload) => http.patch("/auth/change-password", payload),
};
