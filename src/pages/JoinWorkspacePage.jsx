import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useWorkspaces } from '../hooks/useWorkspaces';
import { getInvitationDetailsApi } from '../apis/workspaceApi';

const JoinWorkspacePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  // Get the centralized handler from the context
  const { currentUser, handleInvitationAction, logout } = useWorkspaces();

  const [status, setStatus] = useState('loading'); // loading, success, error, wrong_user, not_logged_in
  const [invitationDetails, setInvitationDetails] = useState(null);

  useEffect(() => {
    const processInvitation = async () => {
      const token = searchParams.get('token');
      if (!token) {
        setStatus('error');
        setInvitationDetails({ message: 'No invitation token provided.' });
        return;
      }

      try {
        const details = await getInvitationDetailsApi(token);
        setInvitationDetails(details);

        if (currentUser) {
          if (currentUser.email === details.email) {
            // **MODIFICATION**: Use the handler from the context
            // This function handles the API call, data refetching, and success toast.
            await handleInvitationAction(token, 'accept');
            setStatus('success');
            setTimeout(() => navigate('/home'), 2000);
          } else {
            setStatus('wrong_user');
          }
        } else {
          setStatus('not_logged_in');
        }
      } catch (error) {
        setStatus('error');
        setInvitationDetails({
          message:
            error.response?.data?.details ||
            'This invitation is invalid or has expired.',
        });
        console.error('Failed to process invitation:', error);
      }
    };

    // We wait for the currentUser to be available from the context before processing
    if (currentUser !== undefined) {
      processInvitation();
    }
  }, [currentUser, searchParams, navigate, handleInvitationAction]);

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return <p className="text-gray-600">Processing your invitation...</p>;
      case 'success':
        return (
          <>
            <h1 className="text-2xl font-bold text-green-600">Success!</h1>
            <p className="text-gray-600 mt-2">
              You have successfully joined the workspace. Redirecting you now...
            </p>
          </>
        );
      case 'wrong_user':
        return (
          <>
            <h1 className="text-2xl font-bold text-yellow-600">
              Account Mismatch
            </h1>
            <p className="text-gray-600 mt-2">
              This invitation was sent to{' '}
              <strong>{invitationDetails?.email}</strong>, but you are logged in
              as <strong>{currentUser?.email}</strong>.
            </p>
            <p className="mt-4">
              Please{' '}
              <button onClick={logout} className="text-blue-600 underline">
                log out
              </button>{' '}
              and sign in with the correct account to accept this invitation.
            </p>
          </>
        );
      case 'not_logged_in':
        return (
          <>
            <h1 className="text-2xl font-bold text-gray-800">Join Workspace</h1>
            <p className="text-gray-600 mt-2">
              You've been invited to join{' '}
              <strong>{invitationDetails?.Workspace.name}</strong>.
            </p>
            <p className="mt-4">
              Please{' '}
              <Link to="/login" className="text-blue-600 underline">
                log in
              </Link>{' '}
              or{' '}
              <Link to="/register" className="text-blue-600 underline">
                sign up
              </Link>{' '}
              with the email <strong>{invitationDetails?.email}</strong> to
              accept.
            </p>
          </>
        );
      case 'error':
      default:
        return (
          <>
            <h1 className="text-2xl font-bold text-red-600">
              Invitation Error
            </h1>
            <p className="text-gray-600 mt-2">{invitationDetails?.message}</p>
            <Link
              to="/home"
              className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Go to Dashboard
            </Link>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 text-center">
        {renderContent()}
      </div>
    </div>
  );
};

export default JoinWorkspacePage;
