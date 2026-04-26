import axiosClient from "./axiosClient";

export const signup = (data) => axiosClient.post("/auth/signup", data);
export const signin = (data) => axiosClient.post("/auth/signin", data);
export const logout = () => axiosClient.post("/auth/logout");
export const getMe = () => axiosClient.get("/auth/me");
export const updateProfile = (data) => axiosClient.patch("/auth/me", data);
export const refreshTokens = (refresh_token) =>
  axiosClient.post("/auth/refresh", { refresh_token });
