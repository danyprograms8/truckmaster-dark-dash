
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';

const Layout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-truckmaster-dark">
      <Navigation />
      <main className="flex-1 overflow-auto border-none outline-none shadow-none">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
