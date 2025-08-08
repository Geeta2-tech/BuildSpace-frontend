import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUserApi } from '../apis/authApi';
import { useWorkspaces } from '../hooks/useWorkspaces';
import toast from 'react-hot-toast';

const InputField = ({
  label,
  type,
  value,
  onChange,
  showToggle = false,
  toggleVisibility,
  isVisible,
}) => (
  <div className="space-y-2 relative">
    <label className="text-sm text-gray-600">{label}</label>
    <input
      type={showToggle && !isVisible ? 'password' : type}
      value={value}
      onChange={onChange}
      placeholder={`Enter your ${label.toLowerCase()}...`}
      className="w-full px-3 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
    {showToggle && (
      <div
        className="absolute right-3 top-[38px] cursor-pointer text-gray-500"
        onClick={toggleVisibility}
      >
        {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
      </div>
    )}
  </div>
);

const BasicLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { initializeSession } = useWorkspaces();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (email && password) {
      try {
        await loginUserApi({ email, password });
        toast.success('Login successful!');
        await initializeSession();
        navigate('/home');
      } catch (error) {
        toast.error('Login failed. Please check your credentials.');
        console.error('Login failed:', error);
      }
    }
  };

  return (
    <div className="space-y-4">
      <InputField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <div>
        <InputField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          showToggle
          toggleVisibility={() => setPasswordVisible(!passwordVisible)}
          isVisible={passwordVisible}
        />
        {/* **NEW**: Forgot Password Link */}
        <div className="text-right mt-2">
          <Link
            to="/forgot-password" // This should point to your password reset page
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>
      </div>
      <button
        onClick={handleLogin}
        disabled={!(email && password)}
        className="w-full bg-blue-600 text-white py-2.5 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        Log In
      </button>

      <div className="text-center mt-4 text-sm">
        <span className="text-gray-600">Don't have an account? </span>
        <Link
          to="/register"
          className="font-medium text-blue-600 hover:underline"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default BasicLogin;
