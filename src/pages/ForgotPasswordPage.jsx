import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPasswordApi } from '../apis/authApi';
import toast from 'react-hot-toast';
import { Mail, ArrowLeft } from 'lucide-react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPasswordApi(email);
      setSubmitted(true);
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          'Failed to send reset link. Please check the email and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        {submitted ? (
          <div className="text-center">
            <Mail className="w-12 h-12 text-green-500 mx-auto" />
            <h1 className="text-2xl font-bold text-gray-800 mt-4">
              Check your inbox
            </h1>
            <p className="text-gray-600 mt-2">
              We've sent a password reset link to <strong>{email}</strong>.
              Please check your email to continue.
            </p>
            <Link
              to="/login"
              className="mt-6 inline-block w-full bg-blue-600 text-white px-6 py-2 rounded-md"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-800 text-center">
              Forgot Password
            </h1>
            <p className="text-center text-gray-500 mt-2">
              Enter your email and we'll send you a link to reset your password.
            </p>
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Email address"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2.5 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
            <div className="text-center mt-4">
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:underline flex items-center justify-center gap-2"
              >
                <ArrowLeft size={16} /> Back to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
