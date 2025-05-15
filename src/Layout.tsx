
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';

const Layout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-truckmaster-dark text-white">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
