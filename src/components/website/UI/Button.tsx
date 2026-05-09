import Link from "@/components/website/AppLink";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "white"
    | "default"
    | "ghost"
    | "link"
    | "destructive";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  to?: string;
  target?: string;
  prefetch?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  className = "",
  children,
  to,
  prefetch,
  ...props
}) => {
  const target = props.target || "_self";
  const baseStyles =
    "inline-flex items-center justify-center font-bold transition-colors duration-200 rounded-sm uppercase tracking-wide";

  const variants = {
    primary: "bg-jvto-green text-jvto-dark hover:bg-[#8Cb82b]",
    secondary: "bg-jvto-dark text-white hover:bg-gray-800",
    outline:
      "border-2 border-jvto-dark text-jvto-dark hover:bg-jvto-dark hover:text-white",
    white: "bg-white text-jvto-dark hover:bg-gray-100",
    default:
      "bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
    destructive:
      "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  };

  const sizes = {
    default: "h-12 px-6 py-2",
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
    icon: "h-10 w-10",
  };

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  if (to) {
    return (
      <Link target={target} href={to} prefetch={prefetch} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;
