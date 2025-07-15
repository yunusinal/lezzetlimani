import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNotifications } from '../hooks/useNotifications';
import { 
  showSuccessNotification, 
  showErrorNotification, 
  showInfoNotification, 
  showWarningNotification 
} from './ui/notification-container';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export const NotificationDemo: React.FC = () => {
  const { 
    showToast, 
    sendVerificationEmail, 
    sendPasswordResetEmail, 
    sendDiscountEmail 
  } = useNotifications();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendVerification = async () => {
    if (!email) {
      showToast.error('Please enter an email address');
      return;
    }

    setIsLoading(true);
    try {
      await sendVerificationEmail(email, 'test-verification-code');
    } catch (error) {
      console.error('Failed to send verification email:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendPasswordReset = async () => {
    if (!email) {
      showToast.error('Please enter an email address');
      return;
    }

    setIsLoading(true);
    try {
      await sendPasswordResetEmail(email, 'test-reset-code');
    } catch (error) {
      console.error('Failed to send password reset email:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendDiscount = async () => {
    if (!email) {
      showToast.error('Please enter an email address');
      return;
    }

    setIsLoading(true);
    try {
      await sendDiscountEmail(
        email,
        '🍕 Special Discount!',
        'Get 20% off your next order! Use code SAVE20 at checkout.'
      );
    } catch (error) {
      console.error('Failed to send discount email:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-6 space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>Notification System Demo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Toast Notifications */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Toast Notifications</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button 
                onClick={() => showToast.success('Success message!')}
                variant="default"
                size="sm"
              >
                Success Toast
              </Button>
              <Button 
                onClick={() => showToast.error('Error message!')}
                variant="destructive"
                size="sm"
              >
                Error Toast
              </Button>
              <Button 
                onClick={() => showToast.info('Info message!')}
                variant="outline"
                size="sm"
              >
                Info Toast
              </Button>
              <Button 
                onClick={() => showToast.warning('Warning message!')}
                variant="secondary"
                size="sm"
              >
                Warning Toast
              </Button>
            </div>
          </div>

          {/* UI Notifications */}
          <div>
            <h3 className="text-lg font-semibold mb-3">UI Notifications</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button 
                onClick={() => showSuccessNotification('Success!', 'This is a success notification')}
                variant="default"
                size="sm"
              >
                Success UI
              </Button>
              <Button 
                onClick={() => showErrorNotification('Error!', 'This is an error notification')}
                variant="destructive"
                size="sm"
              >
                Error UI
              </Button>
              <Button 
                onClick={() => showInfoNotification('Info!', 'This is an info notification')}
                variant="outline"
                size="sm"
              >
                Info UI
              </Button>
              <Button 
                onClick={() => showWarningNotification('Warning!', 'This is a warning notification')}
                variant="secondary"
                size="sm"
              >
                Warning UI
              </Button>
            </div>
          </div>

          {/* Email Notifications */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Email Notifications</h3>
            <div className="space-y-3">
              <Input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Button 
                  onClick={handleSendVerification}
                  disabled={isLoading}
                  variant="default"
                  size="sm"
                >
                  {isLoading ? 'Sending...' : 'Verification Email'}
                </Button>
                <Button 
                  onClick={handleSendPasswordReset}
                  disabled={isLoading}
                  variant="outline"
                  size="sm"
                >
                  {isLoading ? 'Sending...' : 'Password Reset'}
                </Button>
                <Button 
                  onClick={handleSendDiscount}
                  disabled={isLoading}
                  variant="accent"
                  size="sm"
                >
                  {isLoading ? 'Sending...' : 'Discount Email'}
                </Button>
              </div>
            </div>
          </div>

        </CardContent>
      </Card>
    </motion.div>
  );
};