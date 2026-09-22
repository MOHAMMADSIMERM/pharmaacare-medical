import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { usePharmacy } from '../context/PharmacyContext';

export const ToastContainer: React.FC = () => {
  const { toasts } = usePharmacy();

  return (
    <div
      id="toast-container"
      className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 pointer-events-none"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto px-4 py-3 rounded-xl shadow-xl text-xs sm:text-sm font-bold text-white flex items-center space-x-2 transition-all duration-300 transform translate-y-0 ${
            toast.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
};
