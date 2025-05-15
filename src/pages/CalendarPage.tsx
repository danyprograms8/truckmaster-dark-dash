
import React from 'react';
import Header from '@/components/Header';

const CalendarPage: React.FC = () => {
  return (
    <div className="p-6">
      <Header title="Calendar" subtitle="View schedules and appointments" />
      <div className="bg-truckmaster-card-bg p-5 rounded-lg border border-white/5">
        <p className="text-truckmaster-gray-light">Calendar page content will go here.</p>
      </div>
    </div>
  );
};

export default CalendarPage;
