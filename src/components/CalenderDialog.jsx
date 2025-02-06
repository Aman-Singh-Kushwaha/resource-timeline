import React from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CalendarDialog = ({isOpen, onClose, selectedDate, onSelectDate}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-centre justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-4 rounded shadow-md">
        <ReactDatePicker
          selected={selectedDate}
          onChange={date => onSelectDate(date)}
          inline
          showMonthYearPicker
        />
        <button 
          onClick={onClose} 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default CalendarDialog;