import React from 'react';

const EventPopup = ({ event, onClose, onEdit, onDelete }) => {
  if (!event) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h3 className="text-xl font-bold mb-4">Event Details</h3>
        <div className="mb-4">
          <p>
            <strong>Title:</strong> {event.title || 'New Event'}
          </p>
          <p>
            <strong>Time:</strong> {event.startTime.toFixed(2)} -{' '}
            {event.endTime.toFixed(2)}
          </p>
          <p>
            <strong>Resource:</strong> {event.resource}
          </p>
          <p>
            <strong>Day:</strong> {event.day + 1}
          </p>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => onEdit(event)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(event.id)}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventPopup;
