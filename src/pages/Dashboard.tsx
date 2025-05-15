
import React from 'react';
import Dashboard from '@/components/Dashboard';
import Header from '@/components/Header';

const DashboardPage: React.FC = () => {
  return (
    <div className="p-6">
      <Header title="TruckMaster" subtitle="Load Management" />
      <Dashboard />
    </div>
  );
};

export default DashboardPage;
