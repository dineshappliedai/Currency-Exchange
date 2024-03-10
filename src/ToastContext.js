// ToastContext.js
import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

const sendMail = (message) => {
    // const userConfirmed = window.confirm("An error occurred. Would you like to send an email to report it?");
    // if (userConfirmed) {
    const email = "dineshkumarpv@appliedaiconsulting.com";
    const subject = encodeURIComponent("Error Notification");
    const body = encodeURIComponent(
      `An error occurred:\n\n${message}\n\nPlease look into it as soon as possible.`
    );
  
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    // }
  };

export const ToastProvider = ({ children }) => {
    const [toastList, setToastList] = useState([]);

    const toast = useCallback((message, type = 'info') => {
        const id = Math.random().toString(36).substr(2, 9);
        setToastList((currentToasts) => [...currentToasts, { id, message, type }]);
        
        setTimeout(() => {
            setToastList((currentToasts) => currentToasts.filter(toast => toast.id !== id));
        }, 2000);

        // if (type === 'error') {
        //     sendMail(message); // Call the function to send an email when type is 'error'
        //   }
    }, []);

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <ToastContainer toasts={toastList} />
        </ToastContext.Provider>
    );
};

const ToastContainer = ({ toasts }) => (
    <div aria-live="polite" aria-atomic="true" style={containerStyle}>
        {toasts.map(({ id, message, type }) => (
            <div key={id} style={{ ...toastStyle, ...typeStyles[type] }}>
                {message}
            </div>
        ))}
    </div>
);

const containerStyle = {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: 1000,
  };
  

const toastStyle = {
    marginBottom: '15px',
    padding: '10px',
    color: '#fff',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
};

const typeStyles = {
    info: { backgroundColor: '#329af0' },
    success: { backgroundColor: '#37b24d' },
    error: { backgroundColor: '#f03e3e' },
};
