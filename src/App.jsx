// import Landing from "./pages/Landing";
import RealTimeEditor from './pages/RealTimeEditor';
import Login from './pages/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import NotionClone from './pages/Home';
import WorkspaceCreate from './components/WorkspaceCreate';
import { WorkspaceProvider } from './hooks/WorkspaceContext';
import Landing from './pages/Landing';
import Register from './pages/Register';

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Router>
        <WorkspaceProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<NotionClone />} />
            <Route path="/createworkspace" element={<WorkspaceCreate />} />
            {/* <Route path="/signup" element={<Home />} /> */}
          </Routes>
        </WorkspaceProvider>
      </Router>
    </>
  );
}

export default App;
