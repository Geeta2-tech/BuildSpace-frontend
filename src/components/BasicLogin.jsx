import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../apis/authApi';

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
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (email && password) {
      try {
        const response = await loginUser({ email, password }); // Make sure this sends credentials and uses `withCredentials: true`
        console.log('Login successful:', response);
        navigate('/home');
      } catch (error) {
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
      <InputField
        label="Password"
        type="text"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        showToggle
        toggleVisibility={() => setPasswordVisible(!passwordVisible)}
        isVisible={passwordVisible}
      />
      <button
        onClick={handleLogin}
        disabled={!(email && password)}
        className="w-full bg-blue-600 text-white py-2.5 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        Log In
      </button>
    </div>
  );
};

export default BasicLogin;
