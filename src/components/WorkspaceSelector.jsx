import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Plus, X, Trash2 } from 'lucide-react';
import Avatar from './Avatar';
import { useNavigate } from 'react-router-dom';
import { useWorkspaces } from '../hooks/useWorkspaces';
import { removeAMember } from '../apis/workspaceApi';
import ConfirmationModal from './ConfirmationModal'; // Import the new modal

const WorkspaceSelector = ({
  workspaces,
  workspaceMembers,
  activeWorkspace,
  setActiveWorkspace,
}) => {
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [workspaceToDelete, setWorkspaceToDelete] = useState(null);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const { removeWorkspaceMember, logout, deleteWorkspace } = useWorkspaces();

  const isOwner = activeWorkspace
    ? workspaces.owned.some((ws) => ws.id === activeWorkspace.id)
    : false;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowWorkspaceMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleRemoveMember = async (memberId) => {
    if (!isOwner) return;
    try {
      await removeAMember(activeWorkspace.id, memberId);
      removeWorkspaceMember(memberId);
    } catch (error) {
      console.error('Failed to remove member:', error);
    }
  };

  // Handlers for the delete confirmation flow
  const handleDeleteClick = (workspace) => {
    setWorkspaceToDelete(workspace);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (workspaceToDelete) {
      deleteWorkspace(workspaceToDelete.id);
    }
    setIsDeleteModalOpen(false);
    setWorkspaceToDelete(null);
  };

  const hasWorkspaces =
    workspaces.owned.length > 0 || workspaces.shared.length > 0;

  if (!activeWorkspace) {
    return (
      <div className="p-3 border-b border-gray-800">
        <div
          className="flex items-center justify-between p-2 rounded-md hover:bg-gray-800 cursor-pointer"
          onClick={() => navigate('/createworkspace')}
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-md bg-gray-700 flex items-center justify-center">
              <Plus className="w-4 h-4 text-gray-400" />
            </div>
            <div>
              <div className="text-white text-sm font-medium">
                Create workspace
              </div>
              <div className="text-gray-400 text-xs">
                Get started with a new workspace
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-3 border-b border-gray-800 relative" ref={menuRef}>
        <div
          className="flex items-center justify-between p-2 rounded-md hover:bg-gray-800 cursor-pointer"
          onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
        >
          <div className="flex items-center space-x-3">
            <Avatar className={activeWorkspace.color || 'bg-blue-500'}>
              {activeWorkspace.avatar || activeWorkspace.name?.charAt(0) || 'W'}
            </Avatar>
            <div>
              <div className="text-white text-sm font-medium truncate">
                {activeWorkspace.name}
              </div>
              <div className="text-gray-400 text-xs">
                {activeWorkspace.plan || 'Free'} •{' '}
                {workspaceMembers?.length || 0} members
              </div>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>

        {showWorkspaceMenu && (
          <div className="mt-2 py-2 bg-gray-800 rounded-md w-72 absolute left-0 z-10">
            {hasWorkspaces && (
              <>
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
                            setShowWorkspaceMenu(false);
                          }}
                        >
                          <Avatar
                            className={workspace.color || 'bg-blue-500'}
                            size="sm"
                          >
                            {workspace.avatar ||
                              workspace.name?.charAt(0) ||
                              'W'}
                          </Avatar>
                          <div className="flex-1">
                            <div className="text-white text-sm">
                              {workspace.name}
                            </div>
                            <div className="text-gray-400 text-xs">
                              {workspace.plan || 'Free'}
                            </div>
                          </div>
                        </div>
                        {/* Delete button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent the workspace from being selected
                            handleDeleteClick(workspace);
                          }}
                          className="text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label={`Delete ${workspace.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </>
                )}

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
                          setShowWorkspaceMenu(false);
                        }}
                      >
                        <Avatar
                          className={workspace.color || 'bg-blue-500'}
                          size="sm"
                        >
                          {workspace.avatar || workspace.name?.charAt(0) || 'W'}
                        </Avatar>
                        <div className="flex-1">
                          <div className="text-white text-sm">
                            {workspace.name}
                          </div>
                          <div className="text-gray-400 text-xs">
                            {workspace.plan || 'Free'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}

                <hr className="my-2 border-gray-700" />
              </>
            )}

            {activeWorkspace && (
              <div className="px-3 py-1 text-xs text-gray-400 uppercase tracking-wide mt-2">
                Members
              </div>
            )}

            {workspaceMembers?.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between space-x-3 px-3 py-2 hover:bg-gray-700"
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="bg-gray-500" size="sm">
                    {member.User.name?.charAt(0) || 'M'}
                  </Avatar>
                  <div className="text-sm text-white">{member.User.name}</div>
                </div>
                {isOwner && member.role !== 'owner' && (
                  <button
                    onClick={() => handleRemoveMember(member.userId)}
                    className="text-red-500 text-xs"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}

            <div className="px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 cursor-pointer flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span onClick={() => navigate('/createworkspace')}>
                New workspace
              </span>
            </div>
            <div className="px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 cursor-pointer">
              Add another account
            </div>
            <div
              className="px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 cursor-pointer"
              onClick={logout}
            >
              Log out
            </div>
            <div className="px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 cursor-pointer">
              Get Mac app
            </div>
          </div>
        )}
      </div>
      {/* Render the confirmation modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Workspace"
        message={`Are you sure you want to delete the "${workspaceToDelete?.name}" workspace? This action is permanent and cannot be undone.`}
      />
    </>
  );
};

export default WorkspaceSelector;
