import React from 'react';
import { ChevronDown } from 'lucide-react';
import Avatar from './Avatar';

const UserProfileMenu = ({ currentUser, onProfileClick, onDropdownClick }) => {
  return (
    <div
      className="flex items-center justify-between p-2 rounded-md hover:bg-gray-800 cursor-pointer"
      onClick={onProfileClick} // Click on the main area
    >
      <div className="flex items-center space-x-3 pointer-events-none">
        {' '}
        {/* pointer-events-none to ensure parent div gets the click */}
        <Avatar className="bg-indigo-500">
          {currentUser?.name?.charAt(0) || 'U'}
        </Avatar>
        <div className="text-white text-sm font-medium truncate">
          {currentUser?.name || 'User'}
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevents the profile modal from opening
          onDropdownClick(); // Specifically handles the dropdown action
        }}
        className="p-1 rounded-md hover:bg-gray-700"
        aria-label="Open workspace menu"
      >
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>
    </div>
  );
};

export default UserProfileMenu;
