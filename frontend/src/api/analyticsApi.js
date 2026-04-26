import axiosClient from "./axiosClient";

export const getAnalytics = (teacherId) =>
  axiosClient.get("/classroom/analytics", {
    params: { teacher_id: teacherId },
  });

export const getPrincipalAnalytics = () =>
  axiosClient.get("/principal/analytics");
