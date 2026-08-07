import { useNotification } from '../../../notificacao/hookNotify';
import { NotificationData } from '../../mutiplasNotifacoes';

// Hook simplificado para uso direto nas pages
export const useNotifications = () => {
  const {
    notifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeNotification,
    clearAll
  } = useNotification();

  return {
    // Estado atual das notificações
    notifications,
    
    // Métodos para mostrar notificações
    showSuccess,
    showError, 
    showWarning,
    showInfo,
    
    // Gerenciamento
    removeNotification,
    clearAll,
    
    // Utilitários
    hasNotifications: notifications.length > 0,
    notificationCount: notifications.length
  };
};