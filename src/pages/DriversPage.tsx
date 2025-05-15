
import React from 'react';
import { DataProvider } from '@/components/DataProvider';
import DriversPage from '@/components/DriversPage';
import Header from '@/components/Header';

const DriversPageWrapper: React.FC = () => {
  return (
    <div className="p-6">
      <Header title="Drivers" subtitle="Manage your drivers" />
      <DriversPage />
    </div>
  );
};

export default DriversPageWrapper;
