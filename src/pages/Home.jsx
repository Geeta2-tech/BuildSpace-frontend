import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import { useTheme } from '../hooks/useTheme';
import { useWorkspaces } from '../hooks/useWorkspaces';
import { usePages } from '../hooks/usePages';

const Home = () => {
  const { theme = 'light', toggleTheme } = useTheme();
  const { workspaces, activeWorkspace, setActiveWorkspace, workspaceMembers } =
    useWorkspaces();
  const { recentPages } = usePages();

  return (
    <div
      className={`flex h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}
    >
      <Sidebar
        workspaces={workspaces}
        workspaceMembers={workspaceMembers}
        activeWorkspace={activeWorkspace}
        setActiveWorkspace={setActiveWorkspace}
        theme={'dark'}
        toggleTheme={toggleTheme}
      />
      {activeWorkspace ? (
        <MainContent
          recentPages={recentPages}
          theme={'dark'}
          workspaceTitle={activeWorkspace.name}
        />
      ) : (
        <div className="flex items-center justify-center w-full text-center text-gray-500 mt-20">
          <div>
            <h2 className="text-2xl font-semibold">Welcome to Notion</h2>
            <p className="mt-2">Switch or create your workspace</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
