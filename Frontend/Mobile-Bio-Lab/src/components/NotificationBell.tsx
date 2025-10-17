// src/components/NotificationBell.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../context/usenotification";
import "../style/notification.css";

const NotificationBell: React.FC = () => {
  const { unreadCount } = useNotification();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/notifications"); // ✅ go to notifications page
  };

  return (
    <div className="notification-bell">
      <button className="bell-icon" onClick={handleClick}>
        🔔
        {unreadCount > 0 && <span className="count">{unreadCount}</span>}
      </button>
    </div>
  );
};

export default NotificationBell;
