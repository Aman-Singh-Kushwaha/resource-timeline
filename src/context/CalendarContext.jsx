import React, {createContext, useState, useEffect} from 'react';
import { savetoLocal, loadfromLocal } from '../utils/localStorage';

export const CalendarContext = createContext();

const CalendarProvider = ({children}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState(loadfromLocal('events') || []);
  const [resources, setResources] = useState(loadfromLocal('resources') || []);

  useEffect(() => {
    savetoLocal('events', events);
    savetoLocal('resources', resources);
  },[events,resources]);

  const addResource = (resource) => {
    setResources([...resources, resource]);
  }

  const addEvent = (event) => {
    setEvents([...events, event]);
  }

  const updateEvent = (updatedEvent) => {
    setEvents(events.map((event) => event.id === updatedEvent.id ? updatedEvent : event));
  }

  const deleteEvent = (eventId) => {
    setEvents(events.filter((event) => event.id !== eventId));
  }

  return (
    <CalendarContext.Provider value={{
      currentDate,setCurrentDate,
      events, setEvents, addEvent, updateEvent, deleteEvent,
      resources,setResources, addResource
    }}>
      {children}
    </CalendarContext.Provider>
  );
};

export default CalendarProvider;