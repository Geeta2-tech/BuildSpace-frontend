import  { useState } from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import Avatar from './Avatar';
import { useNavigate } from 'react-router-dom';


const WorkspaceSelector = ({ workspaces, activeWorkspace, setActiveWorkspace }) => {
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="p-3 border-b border-gray-800">
      <div 
        className="flex items-center justify-between p-2 rounded-md hover:bg-gray-800 cursor-pointer"
        onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
      >
        <div className="flex items-center space-x-3">
          <Avatar className={activeWorkspace.color}>{activeWorkspace.avatar}</Avatar>
          <div>
            <div className="text-white text-sm font-medium truncate">{activeWorkspace.name}</div>
            <div className="text-gray-400 text-xs">{activeWorkspace.plan} • {activeWorkspace.members} members</div>
          </div>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </div>

      {showWorkspaceMenu && (
        <div className="mt-2 py-2 bg-gray-800 rounded-md w-72 absolute left-0 z-10">
          <div className="px-3 py-1 text-xs text-gray-400 uppercase tracking-wide">Your Workspaces</div>
          {workspaces.map(workspace => (
            <div 
              key={workspace.id}
              className="flex items-center space-x-3 px-3 py-2 hover:bg-gray-700 cursor-pointer"
              onClick={() => {
                setActiveWorkspace(workspace);
                setShowWorkspaceMenu(false);
              }}
            >
              <Avatar className={workspace.color} size="sm">{workspace.avatar}</Avatar>
              <div className="flex-1">
                <div className="text-white text-sm">{workspace.name}</div>
                <div className="text-gray-400 text-xs">{workspace.plan}</div>
              </div>
              {workspace.isOwner && <div className="w-2 h-2 bg-green-500 rounded-full" />}
            </div>
          ))}
          <hr className="my-2 border-gray-700" />
          <div className="px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 cursor-pointer flex items-center space-x-2" >
            <Plus className="w-4 h-4" />
            <span onClick={() => navigate('/createworkspace')}>New workspace</span>
          </div>
          <div className="px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 cursor-pointer">Add another account</div>
          <div className="px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 cursor-pointer">Log out</div>
          <div className="px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 cursor-pointer">Get Mac app</div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceSelector;
