// components/ServiceCard.js

export default function ServiceCard({ 
  title, 
  description, 
  icon, 
  features = [],
  className = '' 
}) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow ${className}`}>
      {icon && (
        <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      {features.length > 0 && (
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start text-sm text-gray-600">
              <svg className="w-5 h-5 text-indigo-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

