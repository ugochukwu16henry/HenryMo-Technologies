// components/ServiceCard.js

import { FaGlobe, FaMobileAlt, FaCode, FaDatabase, FaCloud, FaRobot } from 'react-icons/fa';

const icons = {
  'Website Development': FaGlobe,
  'Mobile App Development': FaMobileAlt,
  'Custom Software Engineering': FaCode,
  'Database Design & Management': FaDatabase,
  'Cloud Deployment': FaCloud,
  'Digital Automation': FaRobot,
};

export default function ServiceCard({ title, description, price }) {
  const Icon = icons[title] || FaGlobe;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
      <Icon className="text-[#007BFF] text-3xl mb-4" />
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 mb-3">{description}</p>
      {price && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <span className="text-2xl font-bold text-[#007BFF]">{price}</span>
        </div>
      )}
    </div>
  );
}
