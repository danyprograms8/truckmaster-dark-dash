
import React from 'react';

interface HeaderProps {
  title: string;
  subtitle: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <header className="mb-6">
      <h1 className="text-2xl font-bold text-white">{title}</h1>
      <p className="text-truckmaster-gray-light">{subtitle}</p>
    </header>
  );
};

export default Header;
