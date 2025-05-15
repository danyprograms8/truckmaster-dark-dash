
import React from 'react';
import Header from '@/components/Header';

const DriversPage: React.FC = () => {
  return (
    <div className="p-6">
      <Header title="Drivers" subtitle="Manage your drivers" />
      <div className="bg-truckmaster-card-bg p-5 rounded-lg border border-white/5">
        <p className="text-truckmaster-gray-light">Drivers page content will go here.</p>
      </div>
    </div>
  );
};

export default DriversPage;
