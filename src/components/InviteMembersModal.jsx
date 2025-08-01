import { useState } from 'react';
import { X } from 'lucide-react';
import Button from './Button';
import api from '../utils/api';

const InviteMembersModal = ({ activeWorkspace, onClose }) => {
  const [members, setMembers] = useState([]); // To store the added members with roles
  const [inputValue, setInputValue] = useState('');
  const [role, setRole] = useState('viewer');
  const [status, setStatus] = useState([]); // Track the status of each member

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const addMember = () => {
    const email = inputValue.trim();
    if (!email || !isValidEmail(email)) return;
    if (!members.some((m) => m.email === email)) {
      setMembers([...members, { email, role }]);
      setInputValue('');
    }
  };

  const removeMember = (email) => {
    setMembers(members.filter((m) => m.email !== email));
  };

  const inviteMembers = async () => {
    if (!activeWorkspace || members.length === 0) return;

    try {
      const response = await api.post({
        endpoint: `/workspace/add-members?workspaceId=${activeWorkspace.id}`,
        data: {
          members: members,
        },
      });

      // Update the status of each member based on response
      const results = response.map((result, index) => ({
        email: members[index].email,
        status: result.status, // 'added', 'already_member', 'user_not_found'
      }));

      setStatus(results);
      toast.success('Invite process completed!');
      onClose(); // Close the modal after processing the invites
    } catch (err) {
      console.error('Error inviting members:', err);
      toast.error('Failed to invite members.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
      <div className="bg-white rounded-xl w-full max-w-md p-6 relative">
        <button className="absolute top-4 right-4" onClick={onClose}>
          <X className="w-5 h-5 text-gray-500" />
        </button>
        <h2 className="text-xl font-semibold mb-4">Invite Members</h2>

        <div className="mb-4">
          <div className="flex gap-2 mb-2">
            <input
              type="email"
              placeholder="Enter email"
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
            <Button onClick={addMember}>Add</Button>
          </div>
          <div className="space-y-2">
            {members.map((m, i) => (
              <div
                key={i}
                className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded-md"
              >
                <span>
                  {m.email} ({m.role})
                </span>
                <button
                  onClick={() => removeMember(m.email)}
                  className="text-sm text-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <Button onClick={inviteMembers} className="w-full mt-4">
          Add Members
        </Button>

        {/* Display invite status */}
        {status.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Invite Status:</h3>
            <div className="space-y-2">
              {status.map((result, index) => (
                <div key={index} className="text-sm">
                  <span>{result.email}</span>
                  <span
                    className={`ml-2 text-xs ${
                      result.status === 'added'
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}
                  >
                    {result.status === 'added'
                      ? 'Successfully added'
                      : result.status === 'already_member'
                      ? 'Already a member'
                      : 'User not found'}
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
