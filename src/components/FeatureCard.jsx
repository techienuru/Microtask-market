import React from "react";

/**
 * Reusable feature card component for displaying app features
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.icon - Icon component to display
 * @param {string} props.title - Feature title
 * @param {string} props.description - Feature description
 */
export const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-3 mb-3">
        <div className="flex-shrink-0 w-8 h-8 text-blue-600">{icon}</div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
};
