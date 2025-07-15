import React, { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Notification, type NotificationProps } from './notification';

export interface NotificationItem extends Omit<NotificationProps, 'onClose'> {
  id: string;
  duration?: number;
}

interface NotificationContainerProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  className?: string;
}

const positionClasses = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
};

export const NotificationContainer: React.FC<NotificationContainerProps> = ({
  position = 'top-right',
  className = '',
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const addNotification = useCallback((notification: Omit<NotificationItem, 'id'>) => {
    const id = Date.now().toString();
    const newNotification: NotificationItem = {
      ...notification,
      id,
      duration: notification.duration || 5000,
    };
    
    setNotifications(prev => [...prev, newNotification]);

    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Expose functions globally for easy access
  useEffect(() => {
    (window as any).addNotification = addNotification;
    (window as any).removeNotification = removeNotification;
    (window as any).clearAllNotifications = clearAllNotifications;

    return () => {
      delete (window as any).addNotification;
      delete (window as any).removeNotification;
      delete (window as any).clearAllNotifications;
    };
  }, [addNotification, removeNotification, clearAllNotifications]);

  return (
    <div className={`fixed z-50 flex flex-col gap-2 ${positionClasses[position]} ${className}`}>
      <AnimatePresence>
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            {...notification}
            onClose={removeNotification}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Helper functions for easy notification usage
export const showNotification = (notification: Omit<NotificationItem, 'id'>) => {
  if ((window as any).addNotification) {
    (window as any).addNotification(notification);
  }
};

export const showSuccessNotification = (title: string, message?: string, duration?: number) => {
  showNotification({ type: 'success', title, message, duration });
};

export const showErrorNotification = (title: string, message?: string, duration?: number) => {
  showNotification({ type: 'error', title, message, duration });
};

export const showInfoNotification = (title: string, message?: string, duration?: number) => {
  showNotification({ type: 'info', title, message, duration });
};

export const showWarningNotification = (title: string, message?: string, duration?: number) => {
  showNotification({ type: 'warning', title, message, duration });
};