import React, { useState } from 'react';

const ResourceDialog = ({ isOpen, onClose, onSubmit }) => {
  const [resourceTitle, setResourceTitle] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (resourceTitle.trim() === '') return;
    onSubmit(resourceTitle.trim());
    setResourceTitle('');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h3 className="text-xl font-bold mb-4">Add New Resource</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="resourceTitle"
              className="block text-sm font-medium mb-1"
            >
              Resource Title
            </label>
            <input
              id="resourceTitle"
              type="text"
              value={resourceTitle}
              onChange={(e) => setResourceTitle(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter resource title"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Add Resource
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResourceDialog;
