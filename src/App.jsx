// import Landing from "./pages/Landing";
import RealTimeEditor from './pages/RealTimeEditor';
import Login from './pages/login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import NotionClone from './pages/Home';
import WorkspaceCreate from './components/WorkspaceCreate';
import { WorkspaceProvider } from './hooks/WorkspaceContext';

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <WorkspaceProvider>
        <Router>
          <Routes>
            <Route path="/" element={<RealTimeEditor />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<NotionClone />} />
            <Route path="/createworkspace" element={<WorkspaceCreate />} />
            {/* <Route path="/signup" element={<Home />} /> */}
          </Routes>
        </Router>
      </WorkspaceProvider>
    </>
  );
}

export default App;
