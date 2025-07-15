import React from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface NotificationProps {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
  onClose?: (id: string) => void;
  className?: string;
}

const notificationIcons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const notificationStyles = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
};

const iconStyles = {
  success: 'text-green-500',
  error: 'text-red-500',
  info: 'text-blue-500',
  warning: 'text-yellow-500',
};

export const Notification: React.FC<NotificationProps> = ({
  id,
  type,
  title,
  message,
  onClose,
  className,
}) => {
  const Icon = notificationIcons[type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.9 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        'relative flex items-start gap-3 p-4 border rounded-lg shadow-lg backdrop-blur-sm',
        'max-w-sm w-full',
        notificationStyles[type],
        className
      )}
    >
      <Icon className={cn('h-5 w-5 mt-0.5 flex-shrink-0', iconStyles[type])} />
      
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold mb-1">{title}</h4>
        {message && (
          <p className="text-sm opacity-90 leading-relaxed">{message}</p>
        )}
      </div>

      {onClose && (
        <button
          onClick={() => onClose(id)}
          className="flex-shrink-0 p-1 rounded-full hover:bg-black/10 transition-colors"
          aria-label="Close notification"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </motion.div>
  );
};