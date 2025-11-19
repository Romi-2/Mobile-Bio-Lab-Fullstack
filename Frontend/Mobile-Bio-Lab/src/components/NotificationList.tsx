// src/components/NotificationList.tsx
import React from "react";
import { useNotification } from "../context/usenotification";
import type{ Notification } from "../context/notificationContext";
import "../style/notification.css";

const NotificationList: React.FC = () => {
  const { notifications, markNotificationAsRead } = useNotification();

  const handleNotificationClick = (notification: Notification): void => {
    if (!notification.is_read) {
      markNotificationAsRead(notification.id);
    }
  };

  return (
    <div className="notification-page">
      <h2 className="notification-heading">🔔 Notifications</h2>

      {notifications.length === 0 ? (
        <p className="no-notifications">
          🎉 You're all caught up! No new notifications.
        </p>
      ) : (
        <div className="notification-list">
          {notifications.map((notification: Notification) => (
            <div
              key={notification.id}
              className={`notification-item ${notification.is_read ? "read" : "unread"}`}
              onClick={() => handleNotificationClick(notification)}
            >
              <h4 className="notification-title">{notification.title}</h4>
              <p className="notification-message">{notification.message}</p>
              <span className="notification-date">
                {new Date(notification.created_at).toLocaleString()}
              </span>
              {!notification.is_read && <div className="unread-dot"></div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationList;