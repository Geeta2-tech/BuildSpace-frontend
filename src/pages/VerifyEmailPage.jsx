import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { verifyEmailApi } from '../apis/authApi'; // Assuming this function exists
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get('token');
      if (!token) {
        setStatus('error');
        setMessage('No verification token provided.');
        return;
      }

      try {
        await verifyEmailApi(token);
        setStatus('success');
        setMessage('Your email has been successfully verified!');
        toast.success('Email verified! You can now log in.');
        setTimeout(() => navigate('/home'), 3000); // Redirect to Home after 3 seconds
      } catch (error) {
        setStatus('error');
        setMessage(
          error.response?.data?.details ||
            'This verification link is invalid or has expired.'
        );
        console.error('Failed to verify email:', error);
      }
    };

    verifyToken();
  }, [searchParams, navigate]);

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <>
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            <h1 className="text-2xl font-bold text-gray-800 mt-4">
              Verifying your email...
            </h1>
            <p className="text-gray-600 mt-2">Please wait a moment.</p>
          </>
        );
      case 'success':
        return (
          <>
            <CheckCircle className="w-12 h-12 text-green-500" />
            <h1 className="text-2xl font-bold text-gray-800 mt-4">
              Verification Successful!
            </h1>
            <p className="text-gray-600 mt-2">{message}</p>
            <p className="text-sm text-gray-500 mt-2">
              Redirecting you to the login page...
            </p>
          </>
        );
      case 'error':
      default:
        return (
          <>
            <XCircle className="w-12 h-12 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-800 mt-4">
              Verification Failed
            </h1>
            <p className="text-gray-600 mt-2">{message}</p>
            <Link
              to="/login"
              className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-md"
            >
              Go to Login
            </Link>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 text-center flex flex-col items-center">
        {renderContent()}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
