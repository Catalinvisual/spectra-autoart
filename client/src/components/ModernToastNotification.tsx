import React, { useEffect, useState } from 'react';
import './ModernToastNotification.css';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

interface ToastNotificationProps {
  toast: Toast;
  onClose: (id: string) => void;
}

const ModernToastNotification: React.FC<ToastNotificationProps> = ({ toast, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after mount with a small delay to ensure proper rendering
    const animationTimer = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    // Auto close after duration
    if (toast.duration !== 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          onClose(toast.id);
        }, 300); // Wait for animation to complete
      }, toast.duration || 5000);

      return () => {
        clearTimeout(timer);
        clearTimeout(animationTimer);
      };
    }
    
    return () => clearTimeout(animationTimer);
  }, [toast.id, toast.duration, onClose]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return (
          <svg stroke="currentColor" viewBox="0 0 24 24" fill="none" className="toast-icon">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"></path>
          </svg>
        );
      case 'error':
        return (
          <svg stroke="currentColor" viewBox="0 0 24 24" fill="none" className="toast-icon">
            <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"></path>
          </svg>
        );
      case 'warning':
        return (
          <svg stroke="currentColor" viewBox="0 0 24 24" fill="none" className="toast-icon">
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"></path>
          </svg>
        );
      case 'info':
        return (
          <svg stroke="currentColor" viewBox="0 0 24 24" fill="none" className="toast-icon">
            <path d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"></path>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div
      role="alert"
      className={`modern-toast modern-toast-${toast.type} ${isVisible ? 'show' : ''}`}
    >
      <div className="toast-content">
        {getIcon()}
        <p className="toast-message">{toast.message}</p>
      </div>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onClose(toast.id), 300);
        }}
        className="toast-close"
      >
        ×
      </button>
    </div>
  );
};

export default ModernToastNotification;