import React from "react";

interface FeatureCardProps {
  title: string;
  description: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  description,
  title,
}) => {
  return (
    <article className="p-7 col-span-1 bg-white shadow rounded-lg">
      <h4 className="text-gray-800">{title}</h4>
      <p className="text-gray-600 mt-1.5">{description}</p>
    </article>
  );
};