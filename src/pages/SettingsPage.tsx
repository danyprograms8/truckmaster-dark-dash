
import React from 'react';
import Header from '@/components/Header';

const SettingsPage: React.FC = () => {
  return (
    <div className="p-6">
      <Header title="Settings" subtitle="Configure your preferences" />
      <div className="bg-truckmaster-card-bg p-5 rounded-lg border border-white/5">
        <p className="text-truckmaster-gray-light">Settings page content will go here.</p>
      </div>
    </div>
  );
};

export default SettingsPage;
