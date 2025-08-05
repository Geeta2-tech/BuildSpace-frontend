import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { registerUser } from '../apis/authApi';

const Logo = () => (
  <div className="w-8 h-8 bg-white">
    <img
      src="https://cdn-icons-png.flaticon.com/128/5436/5436830.png"
      alt="logo"
    />
  </div>
);

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

const ContinueButton = ({ onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="w-full bg-blue-600 text-white py-2.5 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
  >
    Continue
  </button>
);

const FooterLinks = () => (
  <p className="text-xs text-gray-500 text-center">
    By continuing, you agree to our{' '}
    <a href="#" className="text-blue-600 hover:underline">
      Terms & Conditions
    </a>{' '}
    and{' '}
    <a href="#" className="text-blue-600 hover:underline">
      Privacy Policy
    </a>
  </p>
);

const Register = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (
      email &&
      name &&
      password &&
      confirmPassword &&
      password === confirmPassword
    ) {
      try {
        const response = await registerUser({ email, name, password });
        console.log('User registered:', response);
        navigate('/login');
      } catch (error) {
        console.error('Error registering user:', error);
      }
    }
  };

  const isDisabled = !(
    email &&
    name &&
    password &&
    confirmPassword &&
    password === confirmPassword
  );

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-3">
          <Logo />
          <h1 className="text-2xl font-semibold text-black">Join BuildSpace</h1>
          <p className="text-gray-500">Create your account to get started</p>
        </div>

        <div className="space-y-4">
          <InputField
            label="Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
          <InputField
            label="Confirm Password"
            type="text"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            showToggle
            toggleVisibility={() =>
              setConfirmPasswordVisible(!confirmPasswordVisible)
            }
            isVisible={confirmPasswordVisible}
          />
          <ContinueButton onClick={handleRegister} disabled={isDisabled} />
        </div>

        <FooterLinks />
      </div>
    </div>
  );
};

export default Register;
