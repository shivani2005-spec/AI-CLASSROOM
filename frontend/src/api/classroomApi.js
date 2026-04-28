import axiosClient from "./axiosClient";

export const startMonitoring = (data) =>
  axiosClient.post("/classroom/start-monitoring", data);

export const stopMonitoring = (classId) =>
  axiosClient.post(`/classroom/stop-monitoring/${classId}`);

export const getLiveStatus = (classId) =>
  axiosClient.get(`/classroom/live-status/${classId}`);

export const getNotifications = (limit = 50, teacherId) =>
  axiosClient.get("/classroom/notifications", {
    params: { limit, teacher_id: teacherId },
  });

export const markAlertRead = (alertId) =>
  axiosClient.patch(`/classroom/notifications/${alertId}/read`);

// Teacher APIs
export const getTeacherClasses = () => axiosClient.get("/teacher/classes");
export const getTeacherReports = () => axiosClient.get("/teacher/reports");
export const getAllTeachers = () => axiosClient.get("/teacher/all");

// HOD APIs
export const getLiveAllClasses = () =>
  axiosClient.get("/hod/live-all-classes");
export const getHodAlerts = (limit = 100) =>
  axiosClient.get("/hod/alerts", { params: { limit } });
export const getTeacherPerformance = () =>
  axiosClient.get("/hod/performance");
