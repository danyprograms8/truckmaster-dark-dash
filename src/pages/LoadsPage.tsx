
import React from 'react';
import Header from '@/components/Header';

const LoadsPage: React.FC = () => {
  return (
    <div className="p-6">
      <Header title="Loads" subtitle="Manage your shipments" />
      <div className="bg-truckmaster-card-bg p-5 rounded-lg border border-white/5">
        <p className="text-truckmaster-gray-light">Loads page content will go here.</p>
      </div>
    </div>
  );
};

export default LoadsPage;
