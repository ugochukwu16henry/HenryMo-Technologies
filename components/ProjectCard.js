// components/ProjectCard.js

import Link from 'next/link';

export default function ProjectCard({ 
  title, 
  description, 
  image, 
  techStack = [], 
  liveUrl, 
  githubUrl,
  className = '' 
}) {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${className}`}>
      {image && (
        <div className="h-48 bg-gray-200 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.classList.add('bg-gradient-to-br', 'from-indigo-400', 'to-purple-500');
            }}
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        
        {techStack.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {techStack.map((tech, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        <div className="flex space-x-4">
          {liveUrl && (
            <Link
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
            >
              Live Demo →
            </Link>
          )}
          {githubUrl && (
            <Link
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-700 font-medium text-sm"
            >
              GitHub →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

