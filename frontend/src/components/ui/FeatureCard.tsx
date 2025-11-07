import React from "react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode; // optional icon support
}

export function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className="p-6 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
      {icon && <div className="mb-4 text-blue-600 text-3xl">{icon}</div>}

      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>

      <p className="text-gray-600 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}
