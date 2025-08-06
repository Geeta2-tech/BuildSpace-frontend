import { useState } from 'react';
import { X } from 'lucide-react';
import Button from './Button';
import { inviteMembersApi } from '../apis/workspaceApi'; // Updated import
import toast from 'react-hot-toast';
import { useWorkspaces } from '../hooks/useWorkspaces';

const InviteMembersModal = ({ activeWorkspace, onClose }) => {
  const [members, setMembers] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [role, setRole] = useState('viewer');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState([]);
  const { refetchWorkspaceMembers } = useWorkspaces();

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const addMemberToList = () => {
    const email = inputValue.trim();
    if (!email || !isValidEmail(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    if (!members.some((m) => m.email === email)) {
      setMembers([...members, { email, role }]);
      setInputValue('');
    } else {
      toast.error('This email has already been added to the list.');
    }
  };

  const removeMemberFromList = (email) => {
    setMembers(members.filter((m) => m.email !== email));
  };

  const sendInvitations = async () => {
    if (!activeWorkspace || members.length === 0) return;

    try {
      // **MODIFICATION**: Use the new, specific API function
      const response = await inviteMembersApi(
        activeWorkspace.id,
        members,
        message
      );

      console.log('Invite response:', response);
      setStatus(response);
      toast.success('Invitations process completed!');

      // Refetch members to show newly added ones if any were directly added
      // (or to prepare for future real-time updates)
      await refetchWorkspaceMembers();

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Error sending invitations:', err);
      toast.error('Failed to send invitations.');
    }
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case 'invitation_sent':
        return 'Invitation Sent';
      case 'already_member':
        return 'Already a member';
      case 'user_not_found':
        return 'User not found';
      case 'invitation_pending':
        return 'Invitation already pending';
      default:
        return 'Unknown status';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md p-6 relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold mb-4">Invite Members</h2>

        <div className="mb-4">
          <div className="flex gap-2 mb-2">
            <input
              type="email"
              placeholder="Enter email to invite..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 border border-gray-300 p-2 rounded-md"
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="border border-gray-300 p-2 rounded-md"
            >
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
            </select>
            <Button onClick={addMemberToList}>Add</Button>
          </div>
          <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
            {members.map((m, i) => (
              <div
                key={i}
                className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded-md"
              >
                <span>
                  {m.email} ({m.role})
                </span>
                <button
                  onClick={() => removeMemberFromList(m.email)}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="invite-message"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Add a message (optional)
          </label>
          <textarea
            id="invite-message"
            rows="3"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="They will see this message in the invitation email..."
            className="w-full p-2 border border-gray-300 rounded-md"
          ></textarea>
        </div>

        <Button
          onClick={sendInvitations}
          className="w-full mt-4"
          disabled={members.length === 0}
        >
          Send Invitations
        </Button>

        {status.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Invitation Status:</h3>
            <div className="space-y-2 max-h-24 overflow-y-auto pr-2">
              {status.map((result, index) => (
                <div key={index} className="text-sm flex justify-between">
                  <span>{result.email}</span>
                  <span
                    className={`ml-2 text-xs font-medium ${
                      result.status === 'invitation_sent'
                        ? 'text-green-600'
                        : 'text-yellow-600'
                    }`}
                  >
                    {getStatusMessage(result.status)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InviteMembersModal;
