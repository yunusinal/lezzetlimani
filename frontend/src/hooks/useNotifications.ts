import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { notificationService, type NotificationRequest } from '../services/notificationService';

export interface UseNotificationsReturn {
  // Toast notifications (existing)
  showToast: {
    success: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
    warning: (message: string) => void;
  };
  
  // Email notifications (new)
  sendEmailNotification: (request: NotificationRequest) => Promise<any>;
  sendVerificationEmail: (to: string, code: string) => Promise<any>;
  sendPasswordResetEmail: (to: string, code: string) => Promise<any>;
  sendDiscountEmail: (to: string, title: string, description: string) => Promise<any>;
}

export const useNotifications = (): UseNotificationsReturn => {
  // Toast notification helpers
  const showToast = {
    success: useCallback((message: string) => {
      toast.success(message, {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#10B981',
          color: '#fff',
        },
      });
    }, []),

    error: useCallback((message: string) => {
      toast.error(message, {
        duration: 5000,
        position: 'top-right',
        style: {
          background: '#EF4444',
          color: '#fff',
        },
      });
    }, []),

    info: useCallback((message: string) => {
      toast(message, {
        duration: 4000,
        position: 'top-right',
        icon: 'ℹ️',
        style: {
          background: '#3B82F6',
          color: '#fff',
        },
      });
    }, []),

    warning: useCallback((message: string) => {
      toast(message, {
        duration: 4000,
        position: 'top-right',
        icon: '⚠️',
        style: {
          background: '#F59E0B',
          color: '#fff',
        },
      });
    }, []),
  };

  // Email notification helpers
  const sendEmailNotification = useCallback(async (request: NotificationRequest) => {
    try {
      const response = await notificationService.sendNotification(request);
      showToast.success(response.message || 'Notification sent successfully');
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to send notification';
      showToast.error(errorMessage);
      throw error;
    }
  }, [showToast]);

  const sendVerificationEmail = useCallback(async (to: string, code: string) => {
    try {
      const response = await notificationService.sendVerificationEmail(to, code);
      showToast.success('Verification email sent successfully');
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to send verification email';
      showToast.error(errorMessage);
      throw error;
    }
  }, [showToast]);

  const sendPasswordResetEmail = useCallback(async (to: string, code: string) => {
    try {
      const response = await notificationService.sendPasswordResetEmail(to, code);
      showToast.success('Password reset email sent successfully');
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to send password reset email';
      showToast.error(errorMessage);
      throw error;
    }
  }, [showToast]);

  const sendDiscountEmail = useCallback(async (to: string, title: string, description: string) => {
    try {
      const response = await notificationService.sendDiscountEmail(to, title, description);
      showToast.success('Discount email sent successfully');
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to send discount email';
      showToast.error(errorMessage);
      throw error;
    }
  }, [showToast]);

  return {
    showToast,
    sendEmailNotification,
    sendVerificationEmail,
    sendPasswordResetEmail,
    sendDiscountEmail,
  };
};