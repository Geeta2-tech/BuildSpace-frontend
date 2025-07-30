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
  Moon
} from 'lucide-react';
import WorkspaceSelector from './WorkspaceSelector';
import Button from './Button';
import { SIDEBAR_ITEMS, PRIVATE_PAGES } from '../utils/constants';

const Sidebar = ({ workspaces, activeWorkspace, setActiveWorkspace, theme, toggleTheme }) => {
  return (
    <div className="w-64 bg-[rgba(0,0,0,0.87)] border-r border-gray-700 flex flex-col h-full">
      <WorkspaceSelector 
        workspaces={workspaces}
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
                item.active ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span className="text-sm">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Shared Section */}
        <div className="mt-6">
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-2 px-3">Shared</div>
          <div className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-300 hover:bg-gray-800 cursor-pointer">
            <FileText className="w-4 h-4" />
            <span className="text-sm">Data Representation and...</span>
          </div>
        </div>

        {/* Private Section */}
        <div className="mt-6">
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-2 px-3">Private</div>
          <div className="space-y-1">
            {PRIVATE_PAGES.map((page, index) => (
              <div 
                key={index}
                className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-300 hover:bg-gray-800 cursor-pointer"
              >
                <span className="text-sm">{page.icon}</span>
                <span className="text-sm">{page.label}</span>
              </div>
            ))}
            <div className="px-3 py-1">
              <div className="text-xs text-gray-500">• • •</div>
              <Button variant="ghost" size="sm" className="mt-1 text-xs">
                More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-gray-800 space-y-2">
        <Button variant="ghost" className="w-full justify-start">
          <UserPlus className="w-4 h-4 mr-2" />
          Invite members
        </Button>
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <HelpCircle className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;