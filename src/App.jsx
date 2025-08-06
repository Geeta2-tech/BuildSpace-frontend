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
import JoinWorkspacePage from './pages/JoinWorkspacePage';
import ProtectedRoute from './components/ProtectedRoute';
import VerifyEmailPage from './pages/VerifyEmailPage';

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
            <Route path="/join-workspace" element={<JoinWorkspacePage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <NotionClone />
                </ProtectedRoute>
              }
            />
            <Route
              path="/createworkspace"
              element={
                <ProtectedRoute>
                  <WorkspaceCreate />
                </ProtectedRoute>
              }
            />
            <Route
              path="/editor"
              element={
                <ProtectedRoute>
                  <RealTimeEditor />
                </ProtectedRoute>
              }
            />
          </Routes>
        </WorkspaceProvider>
      </Router>
    </>
  );
}

export default App;
