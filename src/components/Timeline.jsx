import React, { useContext, useState } from 'react';
import { format, getDaysInMonth, isToday } from 'date-fns';
import { Rnd } from 'react-rnd';
import { CalendarContext } from '../context/CalendarContext';
import EventPopup from './EventPopup';

// Helper: Convert pixel value (0-96) to a formatted time string.
// Each pixel = 15 minutes.
const convertPxToTimeString = (px) => {
  const totalMinutes = px * 15;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const period = hours >= 12 ? 'pm' : 'am';
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;
  const displayMinutes = minutes.toString().padStart(2, '0');
  return `${displayHour}:${displayMinutes} ${period}`;
};

const Timeline = () => {
  const { currentMonth, resources, events, addEvent, updateEvent, deleteEvent } = useContext(CalendarContext);
  const [dragEvent, setDragEvent] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  // Each day cell is fixed at 96px width representing a full day (24 hours).
  const dayCellWidth = 96;
  const daysInMonth = getDaysInMonth(currentMonth);

  // Utility to pick a color based on resource index.
  const getRandomColor = (resourceIndex) => {
    const colors = [
      "#fb7185", "#e879f9", "#eab308", "#C38F63", "#84cc16",
      "#D35A5A", "#A03333", "#A0A033", "#33A033", "#33A0A0",
      "#2E5A88", "#6D5ACF", "#CBC3E3", "#FF9933", "#FFCC99"
    ];
    return colors[resourceIndex % colors.length];
  };

  // Handler for double-click: create a full-day event in the cell.
  const handleCellDoubleClick = (resource, day, e) => {
    // Prevent if the target is inside an existing event.
    if (e.target.closest('.event-block')) return;
    
    const newEvent = {
      id: Date.now(),
      title: 'New Event',
      resource,
      day,
      start: 0,            // start at left edge (0px)
      width: dayCellWidth, // full day (96px)
      color: getRandomColor(resource),
      startTime: 0,
      endTime: 24,
      month: currentMonth.getMonth(),
      year: currentMonth.getFullYear(),
    };
    addEvent(newEvent);
  };

  // Handler for mouse down to start click-and-drag event creation.
  const handleCellMouseDown = (e, resource, day) => {
    // If mousedown occurs on an existing event, do nothing.
    if (e.target.closest('.event-block')) return;
    
    e.preventDefault();
    const cellRect = e.currentTarget.getBoundingClientRect();
    const start = e.clientX - cellRect.left; // relative start (0 to 96)
    
    // Capture drag data in a local variable.
    let currentDrag = { resource, day, start, width: 0, cellRect };
    setDragEvent(currentDrag);

    const handleMouseMove = (ev) => {
      const newWidth = Math.max(ev.clientX - cellRect.left - start, 0);
      currentDrag.width = newWidth;
      setDragEvent({ ...currentDrag });
    };

    const handleMouseUp = () => {
      if (currentDrag.width > 10) { // minimal drag threshold
        // Convert px to hours: each px = 0.25 hour.
        const startTime = currentDrag.start * 0.25;
        const endTime = (currentDrag.start + currentDrag.width) * 0.25;
        const newEvent = {
          id: Date.now(),
          title: 'New Event',
          resource,
          day,
          start: currentDrag.start,
          width: currentDrag.width,
          color: getRandomColor(resource),
          startTime,
          endTime,
          month: currentMonth.getMonth(),
          year: currentMonth.getFullYear(),
        };
        addEvent(newEvent);
      }
      setDragEvent(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Build header row for dates.
  const headerCells = [];
  headerCells.push(
    <div
      key="header-empty"
      className="flex justify-start items-start pl-2 sticky left-0 z-30 w-40 bg-white border border-gray-200 min-w-[160px]"
    />
  );
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateKey = format(date, 'yyyy-MM-dd');
    headerCells.push(
      <div
        key={dateKey}
        className="flex justify-start items-center w-[96px] border border-gray-200 bg-white py-1 sticky top-0 z-20 select-none"
      >
        <span className={`py-1 px-2 text-sm ${isToday(date) ? 'bg-blue-500 text-white rounded-full' : ''}`}>
          {format(date, 'd EEE')}
        </span>
      </div>
    );
  }

  // Use resources from context; if empty, use a default.
  const resourceList = resources && resources.length > 0 ? resources : ['Resource A'];

  const resourceRows = resourceList.map((resource, rowIndex) => {
    const cells = [];
    // Resource header cell.
    cells.push(
      <div
        key={`resource-header-${rowIndex}`}
        className="flex justify-start items-start pl-2 w-40 border border-gray-200 bg-white sticky font-medium left-0 z-30 select-none min-w-[160px]"
      >
        {typeof resource === 'string'
          ? resource
          : `Resource ${String.fromCharCode(65 + rowIndex)}`}
      </div>
    );
    // Generate day cells.
    for (let day = 1; day <= daysInMonth; day++) {
      const dayIndex = day - 1;
      // Filter events for this cell – check resource, day, month, and year.
      const cellEvents = events.filter(ev =>
        ev.resource === rowIndex &&
        ev.day === dayIndex &&
        ev.month === currentMonth.getMonth() &&
        ev.year === currentMonth.getFullYear()
      );
      cells.push(
        <div
          key={`cell-${rowIndex}-${day}`}
          className="flex justify-center items-center py-2 px-1 border border-gray-200 h-16 w-[96px] relative"
          onDoubleClick={(e) => handleCellDoubleClick(rowIndex, dayIndex, e)}
          onMouseDown={(e) => handleCellMouseDown(e, rowIndex, dayIndex)}
        >
          {cellEvents.map(ev => {
            const startTimeString = convertPxToTimeString(ev.start);
            const endTimeString = convertPxToTimeString(ev.start + ev.width);
            return (
              <Rnd
                key={ev.id}
                // bounds="parent"
                size={{ width: ev.width, height: '75%' }}
                position={{ x: ev.start, y: 0 }}
                enableResizing={{
                  left: true,
                  right: true,
                  top: false,
                  bottom: false,
                  topLeft: false,
                  topRight: false,
                  bottomLeft: false,
                  bottomRight: false,
                }}
                onDragStop={(e, d) => {
                  const newStart = d.x;
                  updateEvent({ 
                    ...ev, 
                    start: newStart, 
                    startTime: newStart * 0.25, 
                    endTime: (newStart + ev.width) * 0.25 
                  });
                }}
                onResizeStop={(e, direction, ref, delta, position) => {
                  const newWidth = parseFloat(ref.style.width);
                  updateEvent({ 
                    ...ev, 
                    width: newWidth, 
                    endTime: (ev.start + newWidth) * 0.25 
                  });
                }}
                className="event-block"
              >
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedEvent(ev);
                  }}
                  className="w-full h-full cursor-pointer"
                  style={{ backgroundColor: ev.color }}
                >
                  <div className="text-xs font-medium">{ev.title || 'New Event'}</div>
                  <div className="text-[10px]">
                    {startTimeString} - {endTimeString}
                  </div>
                </div>
              </Rnd>
            );
          })}
          {dragEvent &&
            dragEvent.resource === rowIndex &&
            dragEvent.day === dayIndex && (
              <div
                className="absolute z-30 rounded p-1 text-xs font-medium opacity-70"
                style={{
                  backgroundColor: getRandomColor(rowIndex),
                  left: dragEvent.start,
                  width: dragEvent.width,
                  top: 0,
                  height: '75%'
                }}
              >
                New Event
              </div>
            )}
        </div>
      );
    }
    return (
      <div key={`row-${rowIndex}`} className="grid grid-flow-col auto-cols-max">
        {cells}
      </div>
    );
  });

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <div className="min-w-max">
          <div className="grid grid-flow-col auto-cols-max">
            {headerCells}
          </div>
          {resourceRows}
        </div>
      </div>
      {selectedEvent && (
        <EventPopup
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onEdit={(ev) => {
            console.log('Edit event:', ev);
            // Implement editing logic as needed.
          }}
          onDelete={(id) => {
            deleteEvent(id);
            setSelectedEvent(null);
          }}
        />
      )}
    </div>
  );
};

export default Timeline;
