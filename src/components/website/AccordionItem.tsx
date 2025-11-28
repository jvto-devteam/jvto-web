import React from 'react';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, children, isOpen, onClick }) => {
  return (
    <div className="border-b border-ink-neutral-200 dark:border-ink-neutral-700 last:border-b-0">
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center text-left py-5 px-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
        aria-expanded={isOpen}
      >
        <span className="text-lg font-semibold text-ink-primary dark:text-white">{title}</span>
        <span className={`material-symbols-outlined transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
          expand_more
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1000px]' : 'max-h-0'}`}>
        <div className="pb-5 px-4 text-ink-neutral-700 dark:text-ink-neutral-200">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AccordionItem;