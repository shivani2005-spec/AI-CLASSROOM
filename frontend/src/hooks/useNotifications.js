import { useState, useCallback } from "react";
import { getNotifications, markAlertRead } from "../api/classroomApi";

/**
 * useNotifications — fetches alerts and manages read state.
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async (limit = 50, teacherId) => {
    setLoading(true);
    try {
      const { data } = await getNotifications(limit, teacherId);
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.is_read).length);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const markRead = useCallback(async (alertId) => {
    try {
      await markAlertRead(alertId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === alertId ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark alert as read:", err);
    }
  }, []);

  const addNotification = useCallback((alert) => {
    setNotifications((prev) => [alert, ...prev.slice(0, 199)]);
    setUnreadCount((prev) => prev + 1);
  }, []);

  return { notifications, loading, unreadCount, fetchNotifications, markRead, addNotification };
}
