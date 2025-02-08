import React from 'react';
import CalendarProvider from './context/CalendarContext.jsx';
import CalendarNav from './components/CalendarNav';
import Timeline from './components/Timeline';

function App() {
  return (
    <CalendarProvider>
      <div className="p-4">
        <CalendarNav />
        <Timeline />
      </div>
    </CalendarProvider>
  );
}

export default App;
