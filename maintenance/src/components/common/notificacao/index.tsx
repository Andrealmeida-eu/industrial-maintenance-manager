// components/Notification.tsx
import React, { useEffect } from 'react';

interface NotificationProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string | null;
  onClose: () => void;
  autoClose?: number; // Auto-fechar após X milissegundos (opcional)
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

const Notification: React.FC<NotificationProps> = ({ 
  type, 
  message, 
  onClose, 
  autoClose = 3000,
  position = 'top-left'
}) => {
  useEffect(() => {
    if (autoClose && message) {
      const timer = setTimeout(() => {
        onClose();
      }, autoClose);

      return () => clearTimeout(timer);
    }
  }, [message, autoClose, onClose]);

  if (!message) return null;

  const typeClasses = {
    success: 'is-success is-light',
    error: 'is-danger is-light',
    warning: 'is-warning is-light',
    info: 'is-info is-light'
  };

  const positionClasses = {
    'top-right': 'notification-top-right',
    'top-left': 'notification-top-left',
    'bottom-right': 'notification-bottom-right',
    'bottom-left': 'notification-bottom-left'
  };

  return (
    <div className={`notification ${typeClasses[type]} ${positionClasses[position]} notification-global`}>
      <button className="delete" onClick={onClose}></button>
      <div className="notification-content">
        <strong className="notification-title">
          {type === 'success' && 'Sucesso!'}
          {type === 'error' && 'Erro!'}
          {type === 'warning' && 'Aviso!'}
          {type === 'info' && 'Informação!'}
        </strong>
        <div className="notification-message">{message}</div>
      </div>
    </div>
  );
};

export default Notification;