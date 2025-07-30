import React, { useState } from 'react';
import api from '../utils/api'; // Import the api functions

const WorkspaceCreate = () => {
  const [title, setTitle] = useState(''); // State to hold the workspace title
  const [members, setMembers] = useState(''); // State to hold the members (optional)

  // Handle title change
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  // Handle members change (optional field)
  const handleMembersChange = (e) => {
    setMembers(e.target.value);
  };

  // Function to create workspace
  const createWorkspace = async () => {
    if (!title) {
      alert('Title is required');
      return;
    }

    const data = { name: title };
    if (members) {
      // Optionally, you can add members to the request data
      data.members = members.split(',').map((member) => member.trim());
    }

    try {
      const response = await api.post({
        endpoint: '/workspace/create',
        data,
      });
      console.log('Workspace created:', response);
      // You can navigate to a different page or show success message
    } catch (error) {
      console.error('Error creating workspace:', error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 border border-gray-300 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">Create Workspace</h2>
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Workspace Title (Required)
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={handleTitleChange}
          placeholder="Enter workspace title"
          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>
      <div className="mb-6">
        <label htmlFor="members" className="block text-sm font-medium text-gray-700">
          Add Members (Optional)
        </label>
        <input
          type="text"
          id="members"
          value={members}
          onChange={handleMembersChange}
          placeholder="Enter member emails separated by commas"
          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <button
        onClick={createWorkspace}
        className="w-full p-3 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Create Workspace
      </button>
    </div>
  );
};

export default WorkspaceCreate;
