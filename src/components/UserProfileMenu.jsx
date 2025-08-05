import React from 'react';
import { ChevronDown } from 'lucide-react';
import Avatar from './Avatar';

const UserProfileMenu = ({ currentUser, onClick }) => {
  return (
    <div
      className="flex items-center justify-between p-2 rounded-md hover:bg-gray-800 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center space-x-3">
        <Avatar className="bg-indigo-500">
          {currentUser?.name?.charAt(0) || 'U'}
        </Avatar>
        <div className="text-white text-sm font-medium truncate">
          {currentUser?.name || 'User'}
        </div>
      </div>
      <ChevronDown className="w-4 h-4 text-gray-400" />
    </div>
  );
};

export default UserProfileMenu;
