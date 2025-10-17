import React from "react";
import { useNotification } from "../context/usenotification";
import "../style/notification.css";

interface AppNotification {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const NotificationList: React.FC = () => {
  const { notifications } = useNotification();

  const typedNotifications = notifications as unknown as AppNotification[];

  return (
    <div className="notification-page">
      <h2 className="notification-heading">🔔 Notifications</h2>

      {typedNotifications.length === 0 ? (
        <p className="no-notifications">
          🎉 You’re all caught up! No new notifications.
        </p>
      ) : (
        <div className="notification-list">
          {typedNotifications.map((n) => (
            <div
              key={n.id}
              className={`notification-item ${n.is_read ? "read" : "unread"}`}
            >
              <h4 className="notification-title">{n.title}</h4>
              <p className="notification-message">{n.message}</p>
              <span className="notification-date">
                {new Date(n.created_at).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationList;
