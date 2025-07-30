import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import api from '../utils/api'; // Make sure to import the api utility

// Logo Component
const Logo = () => (
  <div className="w-8 h-8 bg-white">
    <img src="https://cdn-icons-png.flaticon.com/128/5436/5436830.png" alt="logo" />
  </div>
);

// Social Login Button Component
const SocialButton = ({ icon, text, onClick, isImage = false }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
  >
    {isImage ? (
      <img src={icon} alt="" className="w-5 h-5" />
    ) : (
      <span className="text-lg">{icon}</span>
    )}
    <span className="text-gray-700 font-medium">{text}</span>
  </button>
);

// Email Input Component
const EmailInput = ({ value, onChange, showVerification }) => (
  <div className="space-y-2">
    <label className="text-sm text-gray-600">Email</label>
    <div className="relative">
      <input
        type="email"
        value={value}
        onChange={onChange}
        placeholder="Enter your email address..."
        disabled={showVerification}
        className={`w-full px-3 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          showVerification ? 'bg-gray-50 text-gray-600' : ''
        }`}
      />
      {showVerification && (
        <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
          ✕
        </button>
      )}
    </div>
    {!showVerification && (
      <p className="text-xs text-gray-500">
        Use an organization email to easily collaborate with teammates.
      </p>
    )}
  </div>
);

// Verification Code Input Component
const VerificationInput = ({ value, onChange }) => (
  <div className="space-y-2">
    <label className="text-sm text-gray-600">Verification code</label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder="Enter code"
      className="w-full px-3 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
    <p className="text-xs text-gray-500">
      We sent a code to your inbox
    </p>
  </div>
);

// Resend Link Component
const ResendLink = ({ onResend, countdown }) => (
  <div className="text-center">
    {countdown > 0 ? (
      <span className="text-sm text-gray-500">Resend in {countdown}s</span>
    ) : (
      <button 
        onClick={onResend}
        className="text-sm text-blue-600 hover:underline"
      >
        Resend code
      </button>
    )}
  </div>
);

// Continue Button Component
const ContinueButton = ({ onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="w-full bg-blue-600 text-white py-2.5 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
  >
    Continue
  </button>
);

// Footer Links Component
const FooterLinks = () => (
  <p className="text-xs text-gray-500 text-center">
    By continuing, you acknowledge that you understand and agree to the{' '}
    <a href="#" className="text-blue-600 hover:underline">Terms & Conditions</a>
    {' '}and{' '}
    <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
  </p>
);

// Main Login Component
const Login = () => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
  };

  const handleEmailContinue = async () => {
    if (email && !showVerification) {
      // Send verification code if email is provided
      try {
        await api.post({
          endpoint: '/auth/send-verification-code',
          data: { email },
        });
        setShowVerification(true);
        setResendCountdown(16);

        // Start countdown for resend link
        const interval = setInterval(() => {
          setResendCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } catch (error) {
        console.error('Error sending verification code:', error);
      }
    } else if (verificationCode && showVerification) {
      // Verify code and register user
      try {
        const response = await api.post({
          endpoint: '/auth/verify-code-and-register',
          data: { email, code: verificationCode },
        });
        console.log('User registered successfully:', response);
      } catch (error) {
        console.error('Error verifying code and registering:', error);
      }
    }
  };

  const handleResendCode = async () => {
    try {
      console.log(`Resend code to: ${email}`);
      await api.post({
        endpoint: '/auth/send-verification-code',
        data: { email },
      });
      setResendCountdown(16);
      const interval = setInterval(() => {
        setResendCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Error resending verification code:', error);
    }
  };

  const isButtonDisabled = showVerification ? !verificationCode : !email;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <Logo />
          <div>
            <h1 className="text-2xl font-semibold text-black">Think it. Make it.</h1>
            <p className="text-gray-500 mt-1">Log in to your BuildSpace account</p>
          </div>
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-3">
          <GoogleLogin
            onSuccess={credentialResponse => {
              console.log(credentialResponse);
            }}
            onError={() => {
              console.log('Login Failed');
            }}
          />
          <SocialButton 
            icon="👤" 
            text="Log in with passkey" 
            onClick={() => handleSocialLogin('Passkey')}
          />
          <SocialButton 
            icon="🔒" 
            text="Single sign-on (SSO)" 
            onClick={() => handleSocialLogin('SSO')}
          />
        </div>

        {/* Email Login Form */}
        <div className="space-y-4">
          <EmailInput 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            showVerification={showVerification}
          />
          {showVerification && (
            <VerificationInput 
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
          )}
          <ContinueButton 
            onClick={handleEmailContinue}
            disabled={isButtonDisabled}
          />
          {showVerification && (
            <ResendLink 
              onResend={handleResendCode}
              countdown={resendCountdown}
            />
          )}
        </div>

        {/* Footer */}
        <FooterLinks />
      </div>
    </div>
  );
};

export default Login;
