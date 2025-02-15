import React, {useState, useContext} from 'react';
import { CalendarContext } from '../context/CalendarContext';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { format } from 'date-fns';
import CalendarDialog from './CalenderDialog';
import ResourceDialog from './ResourceDialog';

const CalendarNav = () => {
  const { currentMonth, setCurrentMonth, setCurrentDate, addResource } = useContext(CalendarContext);
  const [isResourceDialogOpen, setIsResourceDialogOpen] = useState(false);

  const [isDatepickerOpen, setIsDatepickerOpen] = useState(false);
  const handleMonthClick = () => {
    setIsDatepickerOpen(!isDatepickerOpen);
  }


  const handleMonthSelect = (date) => {
    if (date){
      setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
      setCurrentDate(date);
    }

    setIsDatepickerOpen(false);
  }

  // for month toggle button trio
  const handlePrev = () => {
    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    setCurrentMonth(prevMonth);
  }
  const handleNext = () => {
    const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    setCurrentMonth(nextMonth);
  }
  const handleToday = () => {
    const today = new Date();
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    setCurrentDate(today);
  };

  const handleAddResource = (title) => {
    addResource(title);
    setIsResourceDialogOpen(false);
  };

  return (
    <div className="flex justify-between items-center bg-gray-100 py-2 px-4 w-full sticky top-0 z-40">
      {/* Left wala calender */}
      <div className="relative">
        <button
          className="text-2xl font-regular text-blue-500 hover:opacity-70"
          onClick={() => handleMonthClick()}
        >
          {format(currentMonth, "MMMM yyyy")}
        </button>
        {isDatepickerOpen && (
          <CalendarDialog
            isOpen={isDatepickerOpen}
            selectedMonth={currentMonth}
            onSelectMonth={handleMonthSelect}
          />
        )}
      </div>

      {/* Right wala part */}
      <div className="flex space-x-4 items-center">
        <button onClick={handlePrev}>
          <ChevronLeftIcon color="rgb(59 130 246)" className="hover:opacity-70" />
        </button>
        <button
          className="bg-none text-lg text-blue-500 hover:opacity-70 font-medium"
          onClick={handleToday}
        >
          Today
        </button>
        <button onClick={handleNext}>
          <ChevronRightIcon color="rgb(59 130 246)" className="hover:opacity-70" />
        </button>
        <button 
          onClick={() => setIsResourceDialogOpen(true)}
          className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Add Resource
        </button>
      </div>
      {isResourceDialogOpen && (
        <ResourceDialog 
          isOpen={isResourceDialogOpen}
          onClose={() => setIsResourceDialogOpen(false)}
          onSubmit={handleAddResource}
        />
      )}
    </div>
  );
};

export default CalendarNav;
