
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';

const Layout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-truckmaster-dark">
      <Navigation />
      <main className="flex-1 overflow-auto outline-none border-none bg-truckmaster-dark">
        <div className="bg-truckmaster-dark border-none">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
