import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useWorkspaces } from '../hooks/useWorkspaces';
import { X } from 'lucide-react';

const WorkspaceCreate = () => {
  const [title, setTitle] = useState('');
  const navigate = useNavigate();
  const { addWorkspace } = useWorkspaces();

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const createWorkspace = async () => {
    if (!title) {
      alert('Title is required');
      return;
    }

    try {
      addWorkspace(title);
      toast.success('Workspace created successfully');
      navigate('/home');
    } catch (error) {
      console.error('Error creating workspace:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[rgba(0,0,0,0.9)] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-300 mb-2">
            Create Workspace
          </h1>
          <p className="text-gray-300">
            Set up your new collaborative workspace
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white relative rounded-3xl shadow-xl border border-gray-100 p-8">
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            onClick={() => navigate('/home')}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Workspace Title */}
          <div className="mb-6">
            <label
              htmlFor="title"
              className="flex items-center text-sm font-semibold text-gray-700 mb-3"
            >
              Workspace Title
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={handleTitleChange}
              placeholder="Enter workspace title"
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 text-gray-900 placeholder-gray-400"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={createWorkspace}
            className="w-full bg-gray-300 text-black font-semibold py-4 px-6 rounded-xl hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg"
          >
            Create Workspace
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Need help?{' '}
            <a
              href="#"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceCreate;
