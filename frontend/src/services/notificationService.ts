import axios from '../api/axios';

export interface NotificationRequest {
  type: 'verification' | 'password_reset' | 'discount';
  to: string;
  subject?: string;
  template?: string;
  variables?: Record<string, string>;
}

export interface NotificationResponse {
  message: string;
  status: string;
}

export interface NotificationType {
  type: string;
  description: string;
  required_variables: string[];
}

export interface NotificationTypesResponse {
  supported_types: NotificationType[];
}

const NOTIFICATION_BASE_URL = '/notification';

export const notificationService = {
  async sendNotification(request: NotificationRequest): Promise<NotificationResponse> {
    const response = await axios.post(`${NOTIFICATION_BASE_URL}/send`, request);
    return response.data;
  },

  async getNotificationTypes(): Promise<NotificationTypesResponse> {
    const response = await axios.get(`${NOTIFICATION_BASE_URL}/types`);
    return response.data;
  },

  async sendVerificationEmail(to: string, code: string): Promise<NotificationResponse> {
    return this.sendNotification({
      type: 'verification',
      to,
      variables: { code }
    });
  },

  async sendPasswordResetEmail(to: string, code: string): Promise<NotificationResponse> {
    return this.sendNotification({
      type: 'password_reset',
      to,
      variables: { code }
    });
  },

  async sendDiscountEmail(to: string, title: string, description: string): Promise<NotificationResponse> {
    return this.sendNotification({
      type: 'discount',
      to,
      variables: { title, description }
    });
  }
};