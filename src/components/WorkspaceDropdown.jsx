import {useState} from 'react';
import { Plus, Trash2 as TrashIcon, X } from 'lucide-react';
import Avatar from './Avatar';
import { useNavigate } from 'react-router-dom';
import UserProfileMenu from './UserProfileMenu';
import ProfileModal from './ProfileModal';

const WorkspaceDropdown = ({
  workspaces,
  activeWorkspace,
  setActiveWorkspace,
  workspaceMembers,
  currentUser,
  isOwner,
  handleDeleteClick,
  handleRemoveMemberClick,
  logout,
  onClose,
}) => {
  const navigate = useNavigate();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  

  return (
    <div className="mt-2 py-2 bg-gray-800 rounded-md w-72 absolute left-0 z-10 max-h-[70vh] overflow-y-auto">
      <UserProfileMenu
            currentUser={currentUser}
            onProfileClick={() => setIsProfileModalOpen(true)}
            // onDropdownClick={() => setShowUserMenu(showUserMenu)}

          />

        <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
      {/* Owned Workspaces Section */}
      {workspaces.owned.length > 0 && (
        <>
          <div className="px-3 py-1 text-xs text-gray-400 uppercase tracking-wide">
            Your Workspaces
          </div>
          {workspaces.owned.map((workspace) => (
            <div
              key={workspace.id}
              className="flex items-center justify-between space-x-3 px-3 py-2 hover:bg-gray-700 group"
            >
              <div
                className="flex items-center space-x-3 flex-grow cursor-pointer"
                onClick={() => {
                  setActiveWorkspace(workspace);
                  onClose();
                }}
              >
                <Avatar className={workspace.color || 'bg-blue-500'} size="sm">
                  {workspace.avatar || workspace.name?.charAt(0) || 'W'}
                </Avatar>
                <div className="flex-1">
                  <div className="text-white text-sm">{workspace.name}</div>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(workspace);
                }}
                className="text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label={`Delete ${workspace.name}`}
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </>
      )}

      {/* Shared Workspaces Section */}
      {workspaces.shared.length > 0 && (
        <>
          <div className="px-3 py-1 mt-2 text-xs text-gray-400 uppercase tracking-wide">
            Shared With You
          </div>
          {workspaces.shared.map((workspace) => (
            <div
              key={workspace.id}
              className="flex items-center space-x-3 px-3 py-2 hover:bg-gray-700 cursor-pointer"
              onClick={() => {
                setActiveWorkspace(workspace);
                onClose();
              }}
            >
              <Avatar className={workspace.color || 'bg-blue-500'} size="sm">
                {workspace.avatar || workspace.name?.charAt(0) || 'W'}
              </Avatar>
              <div className="flex-1">
                <div className="text-white text-sm">{workspace.name}</div>
              </div>
            </div>
          ))}
        </>
      )}

      <hr className="my-2 border-gray-700" />

      {/* Members Section */}
      {activeWorkspace && (
        <>
          <div className="px-3 py-1 text-xs text-gray-400 uppercase tracking-wide">
            Members in {activeWorkspace.name}
          </div>
          {workspaceMembers?.map((member) => {
            // **MODIFICATION**: New logic to determine if the remove button should be shown
            const canRemove =
              // Case 1: The current user is the owner and is not looking at their own entry
              (isOwner && member.role !== 'owner') ||
              // Case 2: The current user is NOT the owner but is looking at their own entry (to leave)
              (!isOwner && member.userId === currentUser?.id);

            return (
              <div
                key={member.id}
                className="flex items-center justify-between space-x-3 px-3 py-2 hover:bg-gray-700 group"
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="bg-gray-500" size="sm">
                    {member.User.name?.charAt(0) || 'M'}
                  </Avatar>
                  <div className="text-sm text-white">{member.User.name}</div>
                </div>
                {canRemove && (
                  <button
                    onClick={() => handleRemoveMemberClick(member)}
                    className="text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={`Remove ${member.User.name}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
          <hr className="my-2 border-gray-700" />
        </>
      )}

      {/* Action Buttons */}
      <div
        className="px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 cursor-pointer flex items-center space-x-2"
        onClick={() => navigate('/createworkspace')}
      >
        <Plus className="w-4 h-4" />
        <span>New workspace</span>
      </div>
      <div
        className="px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 cursor-pointer"
        onClick={logout}
      >
        Log out
      </div>
    </div>
  );
};

export default WorkspaceDropdown;
