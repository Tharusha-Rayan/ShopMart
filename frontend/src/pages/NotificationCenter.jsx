
import React, { useEffect } from 'react';
import { useNotification } from '../context/NotificationContext';
import Card from '../components/common/Card';
import { BellIcon, TrashIcon } from '../components/icons';
import './NotificationCenter.css';

const NotificationCenter = () => {
  const { notifications, markAsRead, deleteNotification, fetchNotifications } = useNotification();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = (id) => {
    markAsRead(id);
  };

  const handleDelete = (id) => {
    deleteNotification(id);
  };

  if (notifications.length === 0) {
    return (
      <div className="notifications-empty">
        <div className="container">
          <BellIcon className="empty-icon" />
          <h2>No notifications</h2>
          <p>You're all caught up!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notification-center">
      <div className="container">
        <h1>Notifications</h1>

        <div className="notifications-list">
          {notifications.map((notification) => (
            <Card 
              key={notification._id} 
              className={`notification-item ${!notification.read ? 'unread' : ''}`}
            >
              <div className="notification-content">
                <h3>{notification.title}</h3>
                <p>{notification.message}</p>
                <span className="notification-time">
                  {new Date(notification.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="notification-actions">
                {!notification.read && (
                  <button 
                    className="mark-read-btn"
                    onClick={() => handleMarkAsRead(notification._id)}
                  >
                    Mark as Read
                  </button>
                )}
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(notification._id)}
                >
                  <TrashIcon />
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;

