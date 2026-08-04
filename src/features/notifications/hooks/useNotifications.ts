"use client";

import { useState } from "react";

import { mockNotifications } from "../data/mockNotifications";

export function useNotifications() {
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAsRead = (id: string) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const toggleReadStatus = (id: string) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id ? { ...notification, isRead: !notification.isRead } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({ ...notification, isRead: true }))
    );
  };

  return {
    notifications,
    markAsRead,
    toggleReadStatus,
    markAllAsRead,
  };
}
