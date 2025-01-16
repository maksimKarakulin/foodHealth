import React from 'react';

interface AlertProps {
  children: React.ReactNode;
  type?: 'success' | 'error' | 'warning' | 'info';
  variant?: 'destructive' | 'success' | 'warning' | 'info';
  className?: string; // Add className prop
}

const Alert: React.FC<AlertProps> = ({ children, type = 'info', variant, className }) => {
  let alertClass = 'bg-blue-100 text-blue-700 border border-blue-300';

  const effectiveType = variant || type;

  switch (effectiveType) {
    case 'success':
      alertClass = 'bg-green-100 text-green-700 border border-green-300';
      break;
    case 'error':
    case 'destructive':
      alertClass = 'bg-red-100 text-red-700 border border-red-300';
      break;
    case 'warning':
      alertClass = 'bg-yellow-100 text-yellow-700 border border-yellow-300';
      break;
    case 'info':
      alertClass = 'bg-blue-100 text-blue-700 border border-blue-300';
      break;
    default:
      alertClass = 'bg-gray-100 text-gray-700 border border-gray-300';
  }

  return (
    <div className={`${className} p-4 rounded relative border-l-4 ${alertClass}`}> {/*Use className here*/}
      {children}
    </div>
  );
};

interface AlertDescriptionProps {
  children: React.ReactNode;
}

const AlertDescription: React.FC<AlertDescriptionProps> = ({ children }) => (
  <p className="text-sm">{children}</p>
);

export { Alert, AlertDescription };
