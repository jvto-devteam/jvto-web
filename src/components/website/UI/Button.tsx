import Link from "next/link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'white';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  to?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  children, 
  to,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-bold transition-colors duration-200 rounded-sm uppercase tracking-wide";
  
  const variants = {
    primary: "bg-jvto-green text-jvto-dark hover:bg-[#8Cb82b]",
    secondary: "bg-jvto-dark text-white hover:bg-gray-800",
    outline: "border-2 border-jvto-dark text-jvto-dark hover:bg-jvto-dark hover:text-white",
    white: "bg-white text-jvto-dark hover:bg-gray-100"
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base"
  };

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  if (to) {
    return (
      <Link href={to} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button 
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
