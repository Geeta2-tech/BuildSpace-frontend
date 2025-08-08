import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { sendVerificationCode, verifyCodeAndRegister } from '../apis/authApi';
import BasicLogin from '../components/BasicLogin';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

// Logo Component
const Logo = () => (
  <div className="w-8 h-8 bg-white mx-auto">
    <img
      src="https://cdn-icons-png.flaticon.com/128/5436/5436830.png"
      alt="BuildSpace Logo"
    />
  </div>
);

// Social Login Button Component
const SocialButton = ({ icon, text, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
  >
    <span className="text-lg">{icon}</span>
    <span className="text-gray-700 font-medium">{text}</span>
  </button>
);

// Footer Links Component
const FooterLinks = () => (
  <p className="text-xs text-gray-500 text-center">
    By continuing, you acknowledge that you understand and agree to the{' '}
    <a href="#" className="text-blue-600 hover:underline">
      Terms & Conditions
    </a>{' '}
    and{' '}
    <a href="#" className="text-blue-600 hover:underline">
      Privacy Policy
    </a>
  </p>
);

// Main Login Component
const Login = () => {
  const [loginView, setLoginView] = useState('default'); // 'default', 'basic', 'verify'
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [resendCountdown, setResendCountdown] = useState(0);
  const navigate = useNavigate();

  const startResendTimer = () => {
    setResendCountdown(30);
    const interval = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleEmailContinue = async () => {
    try {
      await sendVerificationCode(email);
      toast.success(`Verification code sent to ${email}`);
      setLoginView('verify');
      startResendTimer();
    } catch (error) {
      toast.error('Failed to send verification code.');
      console.error('Error sending verification code:', error);
    }
  };

  const handleVerifyCode = async () => {
    try {
      await verifyCodeAndRegister(email, parseInt(verificationCode));
      toast.success('Login successful!');
      navigate('/home');
    } catch (error) {
      toast.error('Invalid verification code.');
      console.error('Error verifying code:', error);
    }
  };

  // Renders the initial view with all login options
  const renderDefaultView = () => (
    <>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-black">
          Welcome to BuildSpace
        </h1>
        <p className="text-gray-500 mt-2">
          Log in or create an account to continue
        </p>
      </div>
      <div className="space-y-3">
        <SocialButton
          icon="🚀"
          text="Continue with Email/Password"
          onClick={() => setLoginView('basic')}
        />
      </div>
      <div className="relative flex py-5 items-center">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase">
          Or
        </span>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>
      <div className="space-y-4">
        <div>
          <label htmlFor="email-input" className="sr-only">
            Email
          </label>
          <input
            id="email-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address..."
            className="w-full px-3 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={handleEmailContinue}
          disabled={!email}
          className="w-full bg-blue-600 text-white py-2.5 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Continue with Email
        </button>
      </div>
    </>
  );

  // Renders the view for email and password login
  const renderBasicLoginView = () => (
    <>
      <button
        onClick={() => setLoginView('default')}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        All login options
      </button>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Log in with Email
      </h2>
      <BasicLogin />
    </>
  );

  // Renders the view for entering the verification code
  const renderVerificationView = () => (
    <>
      <button
        onClick={() => setLoginView('default')}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to login options
      </button>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        Check your email
      </h2>
      <p className="text-gray-500 mb-4 text-sm">
        We sent a verification code to <strong>{email}</strong>
      </p>
      <div className="space-y-4">
        <input
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          placeholder="Enter code"
          className="w-full px-3 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={handleVerifyCode}
          disabled={!verificationCode}
          className="w-full bg-blue-600 text-white py-2.5 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Verify
        </button>
        <div className="text-center text-sm">
          {resendCountdown > 0 ? (
            <span className="text-gray-500">
              Resend code in {resendCountdown}s
            </span>
          ) : (
            <button
              onClick={handleEmailContinue}
              className="text-blue-600 hover:underline"
            >
              Resend code
            </button>
          )}
        </div>
      </div>
    </>
  );

  const renderView = () => {
    switch (loginView) {
      case 'basic':
        return renderBasicLoginView();
      case 'verify':
        return renderVerificationView();
      default:
        return renderDefaultView();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <Logo />
      </div>

      <div className="w-full max-w-sm bg-white shadow-lg border rounded-lg p-8">
        {renderView()}
      </div>

      <div className="mt-6 w-full max-w-sm">
        <FooterLinks />
      </div>
    </div>
  );
};

export default Login;
