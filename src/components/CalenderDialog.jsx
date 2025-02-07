import React from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CalendarDialog = ({isOpen, selectedMonth, onSelectMonth}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute z-50 mt-2" style={{ width: '250px' }}>
      <div className="w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-gray-300 mx-auto"></div>
      <ReactDatePicker
        selected={selectedMonth}
        dateFormat="MMMM/yyyy"
        onChange={(date) => onSelectMonth(date)}
        inline
        showMonthYearPicker
      />
      
    </div>
  );
};

export default CalendarDialog;