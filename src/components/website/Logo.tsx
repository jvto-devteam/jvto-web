
import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <img 
      src="https://legacy.javavolcano-touroperator.com/assets/img/jvto-color.png?1702429896" 
      alt="JVTO Tours Logo" 
      className={`h-10 w-auto ${className}`}
    />
  );
};

export default Logo;
