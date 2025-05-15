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
  
  // Define year range constraints
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 5;  // 5 years back
  const maxYear = currentYear + 5;  // 5 years forward
  
  // Load saved preference from localStorage on initial render
  useEffect(() => {
    const savedDateStr = localStorage.getItem('preferredMonthYear');
    const savedAllTime = localStorage.getItem('isAllTimeView') === 'true';
    
    if (savedDateStr && !savedAllTime) {
      setCurrentDate(new Date(savedDateStr));
      const savedYear = new Date(savedDateStr).getFullYear();
      setYearView(savedYear); // Make sure to initialize yearView with the saved year
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
    // Create a new date using the currently viewed year (yearView) and selected month
    const newDate = new Date(yearView, monthIndex, 1);
    
    console.log(`Selected month ${monthIndex} and year ${yearView}, creating date:`, newDate);
    
    setCurrentDate(newDate);
    setIsAllTime(false);
    setIsOpen(false);
    savePreference(newDate, false);
    onDateChange(newDate);
  };
  
  const handleSelectYear = (year: number) => {
    console.log(`Setting year to: ${year}`);
    setYearView(year);
    
    // Also update the current date to use this year but keep the same month
    const currentMonth = currentDate.getMonth();
    const newDate = setYear(currentDate, year);
    setCurrentDate(newDate);
    
    // Switch back to month view after selecting a year
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
    setYearView(today.getFullYear());
    setIsAllTime(false);
    setIsOpen(false);
    savePreference(today, false);
    onDateChange(today);
  };
  
  const handlePreviousYear = () => {
    const newYear = yearView - 1;
    setYearView(newYear);
  };
  
  const handleNextYear = () => {
    const newYear = yearView + 1;
    setYearView(newYear);
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
        <div className="mt-2 text-xs text-center text-muted-foreground">
          Valid range: {minYear} - {maxYear}
        </div>
      </div>
    );
  };
  
  const renderYearSelector = () => {
    // Calculate range of years to display, centered on the current yearView
    const yearsToShow = 9; // Show 9 years (3x3 grid)
    const halfRange = Math.floor(yearsToShow / 2);
    const startYear = yearView - halfRange;
    const years = Array.from({ length: yearsToShow }, (_, i) => startYear + i);
    
    return (
      <div className="p-2">
        <div className="flex justify-between items-center mb-4">
          <Button variant="ghost" size="sm" onClick={() => setYearView(prev => prev - yearsToShow)}>
            <ChevronsUp className="h-4 w-4" />
          </Button>
          <span className="font-bold">Select Year</span>
          <Button variant="ghost" size="sm" onClick={() => setYearView(prev => prev + yearsToShow)}>
            <ChevronsDown className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {years.map(year => (
            <Button
              key={year}
              variant={year === yearView ? "default" : "ghost"}
              className={cn(
                "w-full justify-center py-2",
                (year < minYear || year > maxYear) && "text-gray-500"
              )}
              onClick={() => handleSelectYear(year)}
            >
              {year}
            </Button>
          ))}
        </div>
        <div className="mt-2 text-xs text-center text-muted-foreground">
          Recommended range: {minYear} - {maxYear}
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
