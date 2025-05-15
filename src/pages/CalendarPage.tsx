
import React from 'react';
import Header from '@/components/Header';
import CalendarPage from '@/components/CalendarPage';

const CalendarPageWrapper: React.FC = () => {
  return (
    <div className="p-6">
      <Header title="Calendar" subtitle="View schedules and performance metrics" />
      <div className="bg-truckmaster-card-bg p-5 rounded-lg border border-white/5">
        <CalendarPage />
      </div>
    </div>
  );
};

export default CalendarPageWrapper;
