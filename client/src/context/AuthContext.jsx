import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authApi } from "../api/authApi";
import { notificationApi } from "../api/notificationApi";

export const AuthContext = createContext(null);

const STORAGE_KEY = "esevai-auth";

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : { token: null, user: null };
  });
  const [bootstrapping, setBootstrapping] = useState(Boolean(authState.token));
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (authState.token) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authState));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [authState]);

  useEffect(() => {
    const initialize = async () => {
      if (!authState.token) {
        setBootstrapping(false);
        setNotifications([]);
        return;
      }

      try {
        const [{ data: profileData }, { data: notificationData }] = await Promise.all([
          authApi.me(),
          notificationApi.getNotifications(),
        ]);

        setAuthState((current) => ({
          ...current,
          user: profileData.user,
        }));
        setNotifications(notificationData.notifications);
      } catch (error) {
        setAuthState({ token: null, user: null });
        setNotifications([]);
      } finally {
        setBootstrapping(false);
      }
    };

    initialize();
  }, [authState.token]);

  const login = async (payload) => {
    const { data } = await authApi.login(payload);
    setAuthState(data);
    const notificationResponse = await notificationApi.getNotifications().catch(() => ({ data: { notifications: [] } }));
    setNotifications(notificationResponse.data.notifications);
    toast.success(`Welcome back, ${data.user.name}`);
    return data;
  };

  const register = async (payload) => {
    const { data } = await authApi.register(payload);
    setAuthState(data);
    setNotifications([]);
    toast.success("Account created successfully");
    return data;
  };

  const logout = () => {
    setAuthState({ token: null, user: null });
    setNotifications([]);
    toast.success("Logged out");
  };

  const refreshNotifications = async () => {
    if (!authState.token) {
      return;
    }

    const { data } = await notificationApi.getNotifications();
    setNotifications(data.notifications);
  };

  const markNotificationRead = async (id) => {
    await notificationApi.markRead(id);
    setNotifications((current) =>
      current.map((notification) =>
        notification._id === id ? { ...notification, isRead: true } : notification,
      ),
    );
  };

  const markAllNotificationsRead = async () => {
    await notificationApi.markAllRead();
    setNotifications((current) => current.map((notification) => ({ ...notification, isRead: true })));
  };

  return (
    <AuthContext.Provider
      value={{
        token: authState.token,
        user: authState.user,
        isAuthenticated: Boolean(authState.token && authState.user),
        bootstrapping,
        notifications,
        login,
        register,
        logout,
        refreshNotifications,
        markNotificationRead,
        markAllNotificationsRead,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
