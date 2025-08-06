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
  ChevronDown,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import WorkspaceSelector from './WorkspaceSelector';
import Button from './Button';
import { useState } from 'react';
import InviteMembersModal from './InviteMembersModal';

const Sidebar = ({
  workspaces,
  workspaceMembers,
  activeWorkspace,
  setActiveWorkspace,
  theme,
  toggleTheme,
  pages = [],
  pagesLoading = false,
  pagesError = null,
  onPageSelect, // Add this prop to handle page selection
}) => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  // Add state to manage the visibility of private pages
  const [showPrivatePages, setShowPrivatePages] = useState(true);
  // Add state to manage the visibility of workspace pages when "All Pages" is clicked
  const [showAllPages, setShowAllPages] = useState(false);

  const SIDEBAR_ITEMS = [{ icon: FileText, label: 'All Pages', active: false }];

  // Determine if the current user is the owner of the active workspace.
  // This checks if the active workspace's ID can be found in the list of owned workspaces.
  const isOwner = activeWorkspace
    ? workspaces.owned.some((ws) => ws.id === activeWorkspace.id)
    : false;

  return (
    <div className="w-64 bg-[rgba(0,0,0,0.87)] border-r border-gray-700 flex flex-col h-full">
      <WorkspaceSelector
        workspaces={workspaces}
        workspaceMembers={workspaceMembers}
        activeWorkspace={activeWorkspace}
        setActiveWorkspace={setActiveWorkspace}
      />

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
      </div>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-gray-800 space-y-2">
        {/* The "Invite members" button is now conditionally rendered */}
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

      {/* The Invite Members Modal is also conditionally rendered */}
      {isOwner && showInviteModal && (
        <InviteMembersModal
          activeWorkspace={activeWorkspace}
          onClose={() => setShowInviteModal(false)}
        />
      )}
    </div>
  );
};

export default Sidebar;
