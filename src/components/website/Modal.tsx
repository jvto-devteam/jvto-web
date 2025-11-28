
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-white dark:bg-background-dark rounded-2xl shadow-xl w-11/12 max-w-2xl m-4 relative animate-slide-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 md:p-6 border-b border-ink-neutral-200 dark:border-ink-neutral-700">
          <h3 className="text-xl font-bold text-ink-primary dark:text-white">{title}</h3>
          <button 
            onClick={onClose}
            className="p-2 rounded-full text-ink-neutral-500 hover:bg-ink-neutral-200 dark:hover:bg-ink-neutral-700 transition-colors"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-4 md:p-6 max-h-[70vh] overflow-y-auto">
          <div className="prose dark:prose-invert max-w-none text-ink-neutral-700 dark:text-ink-neutral-200">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
