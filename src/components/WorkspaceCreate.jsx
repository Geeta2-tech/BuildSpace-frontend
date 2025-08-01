import React, { useState } from 'react';
import { X } from 'lucide-react';
import api from '../utils/api'; // Import the api functions
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import { useWorkspaces } from '../hooks/WorkspaceContext'; // Import useWorkspaces hook
import createWorkspaceApi from '../apis/workspaceApi';
const WorkspaceCreate = () => {
  const [title, setTitle] = useState(''); // State to hold the workspace title
  const [members, setMembers] = useState(''); // State to hold the members (optional)
  const [memberChips, setMemberChips] = useState([]); // State to hold member chips
  const [inputValue, setInputValue] = useState(''); // State for current input value
  const navigate = useNavigate(); // Initialize useNavigate hook
  const { addWorkspace } = useWorkspaces(); // Get workspace functions

  // Handle title change
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  // Handle members change (optional field)
  const handleMembersChange = (e) => {
    setMembers(e.target.value);
  };

  // Validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle input change for member chips
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Handle keydown events for member input
  const handleKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      addMemberChip();
    } else if (e.key === 'Backspace' && inputValue === '' && memberChips.length > 0) {
      // Remove last chip when backspace is pressed on empty input
      const newChips = [...memberChips];
      newChips.pop();
      setMemberChips(newChips);
      updateMembersString(newChips);
    }
  };

  // Add member chip
  const addMemberChip = () => {
    const email = inputValue.trim();
    if (email && isValidEmail(email) && !memberChips.includes(email)) {
      const newChips = [...memberChips, email];
      setMemberChips(newChips);
      setInputValue('');
      updateMembersString(newChips);
    }
  };

  // Remove member chip
  const removeMemberChip = (emailToRemove) => {
    const newChips = memberChips.filter(email => email !== emailToRemove);
    setMemberChips(newChips);
    updateMembersString(newChips);
  };

  // Update members string for API compatibility
  const updateMembersString = (chips) => {
    setMembers(chips.join(', '));
  };

  // Function to create workspace
  const createWorkspace = async () => {
    if (!title) {
      alert('Title is required');
      return;
    }

    const data = { name: title };
    if (members) {
      data.members = members.split(',').map((member) => member.trim());
    }

    try {
      console.log(data.name);
      const response = await createWorkspaceApi(data.name);

      console.log('Workspace created:', response);

      // Create new workspace object
      const newWorkspace = {
        id: Date.now(), // Simple ID generation, adjust as needed
        name: title,
        members: data.members || []
      };

      // Add workspace and set as active
      addWorkspace(newWorkspace);

      // Show success toast
      toast.success('Workspace created successfully');

      // Navigate to Home page
      navigate('/home');

    } catch (error) {
      console.error('Error creating workspace:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[rgba(0,0,0,0.9)] via-indigo-50 to-purple-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-300 mb-2">Create Workspace</h1>
          <p className="text-gray-300">Set up your new collaborative workspace</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          {/* Workspace Title */}
          <div className="mb-6">
            <label htmlFor="title" className="flex items-center text-sm font-semibold text-gray-700 mb-3">
              Workspace Title
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={handleTitleChange}
              placeholder="Enter workspace title"
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 text-gray-900 placeholder-gray-400"
              required
            />
          </div>

          {/* Members Section */}
          <div className="mb-8">
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
              Add Members
              <span className="text-gray-400 text-xs ml-2 font-normal">(Optional)</span>
            </label>
            
            {/* Member Chips Container */}
            <div className="border-2 border-gray-200 rounded-xl p-3 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100 transition-all duration-200 min-h-[56px]">
              <div className="flex flex-wrap gap-2 items-center">
                {/* Display member chips */}
                {memberChips.map((email, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm"
                  >
                    <span>{email}</span>
                    <button
                      onClick={() => removeMemberChip(email)}
                      className="hover:bg-white hover:bg-opacity-20 rounded-full p-0.5 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                
                {/* Input for adding new members */}
                <input
                  type="email"
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder={memberChips.length === 0 ? "Enter member emails and press space" : ""}
                  className="flex-1 min-w-[200px] outline-none text-gray-900 placeholder-gray-400 bg-transparent py-2"
                />
              </div>
            </div>
            
            <p className="text-xs text-gray-500 mt-2">
              Enter email addresses and press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">Space</kbd> or <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">Enter</kbd> to add members
            </p>
          </div>

          {/* Create Button */}
          <button
            onClick={createWorkspace}
            className="w-full bg-gray-300 text-black font-semibold py-4 px-6 rounded-xl hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg"
          >
            Create Workspace
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Need help? <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">Contact support</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceCreate;