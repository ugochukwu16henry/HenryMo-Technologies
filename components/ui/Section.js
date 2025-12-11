// components/ui/Section.js

export default function Section({ 
  children, 
  className = '', 
  background = 'white',
  padding = 'lg',
  ...props 
}) {
  const backgroundStyles = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    indigo: 'bg-indigo-50',
  };
  
  const paddingStyles = {
    none: '',
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16',
    xl: 'py-24',
  };
  
  return (
    <section
      className={`${backgroundStyles[background]} ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}

