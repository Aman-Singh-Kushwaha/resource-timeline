import React, {useState, useContext} from 'react';
import { CalendarContext } from '../context/CalendarContext';
import dayjs from 'dayjs';
import CalendarDialog from './CalenderDialog';


const CalendarNav = () => {
  const { currentMonth, setCurrentMonth, setCurrentDate } = useContext (CalendarContext);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleMonthClick = () => {
    setIsDialogOpen(true);
  }
  const handleDialogClose = () => {
    setIsDialogOpen(false);
  }

  const handleDateSelect = (date) => {
    setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    setCurrentDate(date);

    setIsDialogOpen(false);
  }

  // for month toggle button trio
  const handlePrev = () => {
    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    setCurrentDate(prevMonth);
  }
  const handleNext = () => {
    const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    setCurrentDate(nextMonth);
  }
  const handleToday = () => {
    setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    setCurrentDate(new Date());
  };

  return (
    <div className="flex justify-between items-center p-4 border-b">
      <div className="cursor-pointer" onClick={handleMonthClick}>
        <h2 className="text-xl font-bold text-blue-600">
          {dayjs(currentMonth).format("MMMM YYYY")}
        </h2>
      </div>

      <div className='flextems-center gap-2'>
        <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white"onClick={handlePrev}>
          {'<'}
        </button>
        <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white" onClick={handleToday}>
          Today  
        </button>
        <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white" onClick={handleNext}>
          {'>'}
        </button>

        <button 
          onClick={() => console.log("Add Resource clicked")}
          className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Add Resource
        </button>
      </div>
      <CalendarDialog 
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        selectedDate={currentMonth}
        onSelectDate={handleDateSelect}
      />
    </div>
  );
};

export default CalendarNav;