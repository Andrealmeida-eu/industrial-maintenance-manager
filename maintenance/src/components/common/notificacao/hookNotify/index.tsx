import { useState, useCallback } from 'react';
import { NotificationData } from '../../notificacao/mutiplasNotifacoes';

export const useNotification = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  // Adicionar uma nova notificação
  const addNotification = useCallback((
    type: 'success' | 'error' | 'warning' | 'info',
    message: string,
    autoClose?: number
  ) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    
    const newNotification: NotificationData = {
      id,
      type,
      message,
      autoClose
    };

    setNotifications(prev => [...prev, newNotification]);
    return id;
  }, []);

  // Remover uma notificação específica
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  // Métodos auxiliares para cada tipo
  const showSuccess = useCallback((message: string, autoClose?: number) => {
    return addNotification('success', message, autoClose);
  }, [addNotification]);

  const showError = useCallback((message: string, autoClose?: number) => {
    return addNotification('error', message, autoClose);
  }, [addNotification]);

  const showWarning = useCallback((message: string, autoClose?: number) => {
    return addNotification('warning', message, autoClose);
  }, [addNotification]);

  const showInfo = useCallback((message: string, autoClose?: number) => {
    return addNotification('info', message, autoClose);
  }, [addNotification]);

  // Limpar todas as notificações
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    // Estado
    notifications,
    
    // Ações
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    clearAll
  };
};