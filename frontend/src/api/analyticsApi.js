import axiosClient from "./axiosClient";

export const getAnalytics = (teacherId) =>
  axiosClient.get("/classroom/analytics", {
    params: { teacher_id: teacherId },
  });

export const getHodAnalytics = () =>
  axiosClient.get("/hod/analytics");
