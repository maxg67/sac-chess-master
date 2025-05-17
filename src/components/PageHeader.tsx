
import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="bg-chess-dark text-white py-8">
      <div className="container mx-auto px-4">
        <h1 className="font-serif text-3xl">{title}</h1>
        {subtitle && <p className="text-gray-300">{subtitle}</p>}
      </div>
    </div>
  );
};

export default PageHeader;
