// components/ui/Card.js

export default function Card({ children, className = '', padding = 'md', ...props }) {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };
  
  return (
    <div
      className={`bg-white rounded-lg shadow-md ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

