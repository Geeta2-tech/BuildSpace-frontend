import {
  Search,
  Home,
  FileText,
  Star,
  Trash2,
  UserPlus,
  Settings,
  HelpCircle,
  Sun,
  Moon,
  Mail,
  Check,
  X,
  ChevronDown,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import Button from './Button';
import { SIDEBAR_ITEMS } from '../utils/constants';
import { useState, useEffect, useRef } from 'react';
import InviteMembersModal from './InviteMembersModal';
import { useWorkspaces } from '../hooks/useWorkspaces';
import ConfirmationModal from './ConfirmationModal';
import UserProfileMenu from './UserProfileMenu'; // Import new component
import WorkspaceDropdown from './WorkspaceDropdown'; // Import new component
import ProfileModal from './ProfileModal';

const Sidebar = ({
  theme,
  toggleTheme,
  pages = [],
  pagesLoading = false,
  pagesError = null,
  onPageSelect, // Add this prop to handle page selection
}) => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [workspaceToDelete, setWorkspaceToDelete] = useState(null);
  const [isRemoveMemberModalOpen, setIsRemoveMemberModalOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState(null);
  // Add state to manage the visibility of private pages
  const [showPrivatePages, setShowPrivatePages] = useState(true);
  // Add state to manage the visibility of workspace pages when "All Pages" is clicked
  const [showAllPages, setShowAllPages] = useState(false);


  const SIDEBAR_ITEMS = [{ icon: FileText, label: 'All Pages', active: false }];

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

 

  const menuRef = useRef(null);

  const {
    currentUser,
    workspaces,
    activeWorkspace,
    setActiveWorkspace,
    workspaceMembers,
    pendingInvitations,
    handleInvitationAction,
    deleteWorkspace,
    removeWorkspaceMember,
    logout,
  } = useWorkspaces();

  const isOwner = activeWorkspace
    ? workspaces.owned.some((ws) => ws.id === activeWorkspace.id)
    : false;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  const handleRemoveMemberClick = (member) => {
    setMemberToRemove(member);
    setIsRemoveMemberModalOpen(true);
  };

  const handleConfirmRemove = () => {
    if (memberToRemove) {
      removeWorkspaceMember(activeWorkspace.id, memberToRemove.userId);
    }
    setIsRemoveMemberModalOpen(false);
    setMemberToRemove(null);
  };

  return (
    <>
      <div className="w-64 bg-[rgba(0,0,0,0.87)] border-r border-gray-700 flex flex-col h-full">
        <div className="p-3 border-b border-gray-800 relative" ref={menuRef}>
          <UserProfileMenu
            currentUser={currentUser}
            onProfileClick={() => setIsProfileModalOpen(true)}
            onDropdownClick={() => setShowUserMenu(!showUserMenu)}
          />
          {showUserMenu && (
            <WorkspaceDropdown
              workspaces={workspaces}
              activeWorkspace={activeWorkspace}
              setActiveWorkspace={setActiveWorkspace}
              workspaceMembers={workspaceMembers}
              currentUser={currentUser}
              isOwner={isOwner}
              handleDeleteClick={handleDeleteClick}
              handleRemoveMemberClick={handleRemoveMemberClick}
              logout={logout}
              onClose={() => setShowUserMenu(false)}
            />
          )}
        </div>


      {/* Navigation */}
      <div className="flex-1 px-3">
        <div className="space-y-1">
          {SIDEBAR_ITEMS.map((item, index) => (
            <div
              key={index}
              className={`flex items-center space-x-3 px-3 py-2 rounded-md cursor-pointer ${
                (item.label === 'All Pages' && showAllPages) || item.active
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => {
                // Toggle workspace pages when "All Pages" is clicked
                if (item.label === 'All Pages') {
                  setShowAllPages(!showAllPages);
                }
              }}
            >
              <item.icon className="w-4 h-4" />
              <span className="text-sm">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Workspace Pages Section - Only show when showAllPages is true */}
        {activeWorkspace && showAllPages && (
          <div className="mt-6">
            <div className="text-xs text-gray-400 uppercase tracking-wide mb-2 px-3">
              {activeWorkspace.name} Pages
            </div>
            {pagesLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                <span className="text-xs text-gray-400 ml-2">
                  Loading pages...
                </span>

        {/* Search */}
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 border border-gray-700 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Scrollable middle section */}
        <div className="flex-1 px-3 py-2 overflow-y-auto">
          {/* Navigation */}
          <div className="space-y-1">
            {SIDEBAR_ITEMS.map((item, index) => (
              <div
                key={index}
                className={`flex items-center space-x-3 px-3 py-2 rounded-md cursor-pointer ${
                  (item.label === 'All Pages' && showAllPages) || item.active
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => {
                  // Toggle workspace pages when "All Pages" is clicked
                  if (item.label === 'All Pages') {
                    setShowAllPages(!showAllPages);
                  }
                }}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm">{item.label}</span>

              </div>
            ))}
          </div>

          {/* Workspace Pages Section - Only show when showAllPages is true */}
          {activeWorkspace && showAllPages && (
            <div className="mt-6">
              <div className="text-xs text-gray-400 uppercase tracking-wide mb-2 px-3">
                {activeWorkspace.name} Pages
              </div>
              {pagesLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                  <span className="text-xs text-gray-400 ml-2">
                    Loading pages...
                  </span>
                </div>
              ) : pagesError ? (
                <div className="px-3 py-2 text-xs text-red-400">
                  Error loading pages
                </div>
              ) : pages.length > 0 ? (
                <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                  <div className="space-y-1">
                    {pages.map((page) => (
                      <div
                        key={page.id}
                        className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-300 hover:bg-gray-800 cursor-pointer"
                        onClick={() => onPageSelect && onPageSelect(page)} // Add click handler
                      >
                        <FileText className="w-4 h-4" />
                        <span className="text-sm truncate" title={page.title}>
                          {page.title || 'Untitled'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="px-3 py-2 text-xs text-gray-500">
                  No pages yet
                </div>
              )}
            </div>
          )}

          {/* Invitations Section */}
          {pendingInvitations && pendingInvitations.length > 0 && (
            <div className="mt-6">
              <div className="text-xs text-gray-400 uppercase tracking-wide mb-2 px-3 flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                Invitations
              </div>
              <div className="space-y-1">
                {pendingInvitations.map((invite) => (
                  <div
                    key={invite.token}
                    className="p-2 rounded-md bg-gray-800/50 text-gray-300 text-sm"
                  >
                    <p className="mb-2">
                      Join{' '}
                      <span className="font-semibold text-white">
                        {invite.workspace?.name || 'a workspace'} (
                        {invite.role[0].toUpperCase() + invite.role.slice(1)})
                      </span>
                    </p>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() =>
                          handleInvitationAction(invite.token, 'decline')
                        }
                        className="p-1.5 rounded-md text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                        aria-label="Decline invitation"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          handleInvitationAction(invite.token, 'accept')
                        }
                        className="p-1.5 rounded-md text-gray-400 hover:bg-green-500/20 hover:text-green-400 transition-colors"
                        aria-label="Accept invitation"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            

            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-gray-800 space-y-2 mt-auto">
          {isOwner && (
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => setShowInviteModal(true)}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Invite members
            </Button>
          )}
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <HelpCircle className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={toggleTheme}>
              {theme === 'dark' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>


        {isOwner && showInviteModal && (
          <InviteMembersModal
            activeWorkspace={activeWorkspace}
            onClose={() => setShowInviteModal(false)}
          />
        )}
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Workspace"
        message={`Are you sure you want to delete the "${workspaceToDelete?.name}" workspace? This action is permanent and cannot be undone.`}
      />
      <ConfirmationModal
        isOpen={isRemoveMemberModalOpen}
        onClose={() => setIsRemoveMemberModalOpen(false)}
        onConfirm={handleConfirmRemove}
        title="Remove Member"
        message={`Are you sure you want to remove "${memberToRemove?.User.name}" from this workspace?`}
      />
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
};

export default Sidebar;
