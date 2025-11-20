import React, { useState, useEffect } from 'react';
import './ToastNotification.css';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

interface ToastNotificationProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ toast, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  const duration = toast.duration || 5000; // Default 5 seconds
  const type = toast.type;

  useEffect(() => {
    // Show toast with animation
    setTimeout(() => setIsVisible(true), 100);

    // Auto close after duration
    const closeTimer = setTimeout(() => {
      handleClose();
    }, duration);

    // Progress bar animation
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev - (100 / (duration / 100));
        return newProgress <= 0 ? 0 : newProgress;
      });
    }, 100);

    return () => {
      clearTimeout(closeTimer);
      clearInterval(progressTimer);
    };
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose(toast.id);
    }, 300); // Wait for animation to complete
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '✅';
    }
  };

  return (
    <div className={`toast ${type} ${isVisible ? 'show' : 'hide'}`}>
      <div className="toast-content">
        <span className="toast-icon">{getIcon()}</span>
        <span className="toast-message">{toast.message}</span>
        <button className="toast-close" onClick={handleClose}>×</button>
      </div>
      <div 
        className="toast-progress" 
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ToastNotification;