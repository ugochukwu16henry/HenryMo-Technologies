// components/ui/Button.js

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '',
  disabled = false,
  type = 'button',
  ...props 
}) {
  const base = "font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary: "bg-[#007BFF] text-white hover:bg-[#0069d9] focus:ring-[#007BFF]",
    outline: "border-2 border-[#007BFF] text-[#007BFF] hover:bg-[#007BFF] hover:text-white",
    gold: "bg-[#FACC15] text-[#111827] hover:bg-[#eab308] focus:ring-[#FACC15]",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${disabledStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
