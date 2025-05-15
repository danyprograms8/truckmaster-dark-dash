
import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths, setMonth, setYear } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, ChevronsUp, ChevronsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface MonthYearSelectorProps {
  onDateChange: (date: Date) => void;
  showAllTimeOption?: boolean;
}

const MonthYearSelector: React.FC<MonthYearSelectorProps> = ({
  onDateChange,
  showAllTimeOption = true
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [calendarView, setCalendarView] = useState<'month' | 'year'>('month');
  const [yearView, setYearView] = useState<number>(new Date().getFullYear());
  const [isAllTime, setIsAllTime] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  
  // Load saved preference from localStorage on initial render
  useEffect(() => {
    const savedDateStr = localStorage.getItem('preferredMonthYear');
    const savedAllTime = localStorage.getItem('isAllTimeView') === 'true';
    
    if (savedDateStr && !savedAllTime) {
      setCurrentDate(new Date(savedDateStr));
      setIsAllTime(false);
    } else if (savedAllTime) {
      setIsAllTime(true);
    }
  }, []);
  
  // Save preferences to localStorage
  const savePreference = (date: Date, allTime: boolean) => {
    if (allTime) {
      localStorage.setItem('isAllTimeView', 'true');
      localStorage.removeItem('preferredMonthYear');
    } else {
      localStorage.setItem('preferredMonthYear', date.toISOString());
      localStorage.setItem('isAllTimeView', 'false');
    }
  };
  
  const handlePreviousMonth = () => {
    const newDate = subMonths(currentDate, 1);
    setCurrentDate(newDate);
    setIsAllTime(false);
    savePreference(newDate, false);
    onDateChange(newDate);
  };
  
  const handleNextMonth = () => {
    const newDate = addMonths(currentDate, 1);
    setCurrentDate(newDate);
    setIsAllTime(false);
    savePreference(newDate, false);
    onDateChange(newDate);
  };
  
  const handleSelectMonth = (monthIndex: number) => {
    const newDate = setMonth(currentDate, monthIndex);
    setCurrentDate(newDate);
    setIsAllTime(false);
    setIsOpen(false);
    savePreference(newDate, false);
    onDateChange(newDate);
  };
  
  const handleSelectYear = (year: number) => {
    setYearView(year);
    const newDate = setYear(currentDate, year);
    setCurrentDate(newDate);
    setCalendarView('month');
  };
  
  const handleAllTime = () => {
    setIsAllTime(true);
    setIsOpen(false);
    savePreference(new Date(), true);
    onDateChange(null);
  };
  
  const handleCurrentMonth = () => {
    const today = new Date();
    setCurrentDate(today);
    setIsAllTime(false);
    setIsOpen(false);
    savePreference(today, false);
    onDateChange(today);
  };
  
  const handlePreviousYear = () => {
    setYearView(prev => prev - 1);
  };
  
  const handleNextYear = () => {
    setYearView(prev => prev + 1);
  };
  
  const months = [
    'January', 'February', 'March', 'April', 
    'May', 'June', 'July', 'August', 
    'September', 'October', 'November', 'December'
  ];
  
  const renderMonthGrid = () => {
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    return (
      <div className="p-2">
        <div className="flex justify-between items-center mb-4">
          <Button variant="ghost" size="sm" onClick={handlePreviousYear}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            className="font-bold text-lg hover:bg-gray-700"
            onClick={() => setCalendarView('year')}
          >
            {yearView}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleNextYear}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {months.map((month, i) => {
            const isCurrentSelection = i === currentMonth && yearView === currentYear && !isAllTime;
            return (
              <Button
                key={month}
                variant={isCurrentSelection ? "default" : "ghost"}
                className={cn(
                  "w-full justify-center py-2 text-sm",
                  isCurrentSelection && "bg-primary"
                )}
                onClick={() => handleSelectMonth(i)}
              >
                {month.substring(0, 3)}
              </Button>
            );
          })}
        </div>
        <div className="mt-4 flex space-x-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={handleCurrentMonth}>
            Current Month
          </Button>
          {showAllTimeOption && (
            <Button 
              variant={isAllTime ? "default" : "outline"} 
              size="sm" 
              className="flex-1"
              onClick={handleAllTime}
            >
              All Time
            </Button>
          )}
        </div>
      </div>
    );
  };
  
  const renderYearSelector = () => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 7 }, (_, i) => currentYear - 3 + i);
    
    return (
      <div className="p-2">
        <div className="flex justify-between items-center mb-4">
          <Button variant="ghost" size="sm" onClick={() => setYearView(prev => prev - 7)}>
            <ChevronsUp className="h-4 w-4" />
          </Button>
          <span className="font-bold">Select Year</span>
          <Button variant="ghost" size="sm" onClick={() => setYearView(prev => prev + 7)}>
            <ChevronsDown className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {years.map(year => (
            <Button
              key={year}
              variant={year === yearView ? "default" : "ghost"}
              className="w-full justify-center py-2"
              onClick={() => handleSelectYear(year)}
            >
              {year}
            </Button>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="flex items-center justify-center space-x-2 mb-6 bg-card/50 rounded-lg p-2">
      <Button variant="ghost" size="icon" onClick={handlePreviousMonth}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            className="min-w-[140px] hover:bg-card/50 flex items-center space-x-1"
          >
            <CalendarIcon className="h-4 w-4 mr-1" />
            {isAllTime 
              ? <span className="font-medium">All Time</span>
              : <span className="font-medium">{format(currentDate, 'MMMM yyyy')}</span>
            }
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-card" align="center">
          <div className="min-w-[250px]">
            {calendarView === 'month' ? renderMonthGrid() : renderYearSelector()}
          </div>
        </PopoverContent>
      </Popover>
      
      <Button variant="ghost" size="icon" onClick={handleNextMonth}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default MonthYearSelector;
