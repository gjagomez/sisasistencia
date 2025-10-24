import { useState, useCallback } from 'react';
import Toast from './Toast';
import './Toast.css';

let addToastFunc = null;

export const showToast = (message, type = 'info', duration = 4000) => {
  if (addToastFunc) {
    addToastFunc(message, type, duration);
  }
};

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type, duration) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Exponer la función addToast globalmente
  addToastFunc = addToast;

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
