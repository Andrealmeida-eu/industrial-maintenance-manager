// components/NotificationContainer.tsx
import React from 'react';
import Notification from '../../notificacao';

export interface NotificationData {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  autoClose?: number;
}

interface NotificationContainerProps {
  notifications: NotificationData[];
  onRemove: (id: string) => void;
}

const NotificationContainer: React.FC<NotificationContainerProps> = ({ 
  notifications, 
  onRemove 
}) => {
  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          type={notification.type}
          message={notification.message}
          onClose={() => onRemove(notification.id)}
          autoClose={notification.autoClose}
        />
      ))}
    </div>
  );
};

export default NotificationContainer;