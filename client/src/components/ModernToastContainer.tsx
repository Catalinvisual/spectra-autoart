import React from 'react';
import ModernToastNotification from './ModernToastNotification';
import { useToast } from '../contexts/ToastContext';
import './ModernToastNotification.css';

const ModernToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();
  
  console.log('ToastContainer - toasts:', toasts); // Debug log
  if (toasts.length === 0) return null;

  return (
    <div className="modern-toast-container">
      {toasts.map(toast => (
        <ModernToastNotification
          key={toast.id}
          toast={toast}
          onClose={removeToast}
        />
      ))}
    </div>
  );
};

export default ModernToastContainer;