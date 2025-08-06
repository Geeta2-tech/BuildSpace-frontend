import React, { useState, useEffect, useRef } from 'react';
import { X, Loader2, Edit2, Check, Camera } from 'lucide-react';
import Avatar from './Avatar';
import { useWorkspaces } from '../hooks/useWorkspaces';
import { getProfile, updateUsername, createAvatar } from '../apis/profileApi';
import { sendEmailVerification } from '../apis/authApi';
import toast from 'react-hot-toast';

const ProfileModal = ({ isOpen, onClose }) => {
  const { currentUser, fetchCurrentUser: refetchCurrentUser } = useWorkspaces();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [username, setUsername] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen && currentUser) {
      const fetchProfile = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await getProfile(currentUser.id);
          setProfileData(data);
          setUsername(data.name);
        } catch (err) {
          setError('Failed to load profile. Please try again later.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    }
  }, [isOpen, currentUser]);

  const handleUsernameSave = async () => {
    if (username === profileData.name) {
      setIsEditingUsername(false);
      return;
    }
    try {
      await updateUsername(currentUser.id, username);
      setProfileData({ ...profileData, name: username });
      setIsEditingUsername(false);
      refetchCurrentUser(); // Refetch user data to update sidebar
      toast.success('Username updated successfully!');
    } catch (err) {
      toast.error('Failed to update username.');
      console.error(err);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      await createAvatar(currentUser.id, file);
      // Optimistically update the avatar or refetch profile
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({ ...profileData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
      toast.success('Avatar updated successfully!');
    } catch (err) {
      toast.error('Failed to upload avatar.');
      console.error(err);
    }
  };

  const handleVerifyEmail = async () => {
    try {
      await sendEmailVerification();
      toast.success('Verification email sent! Please check your inbox.');
    } catch (err) {
      toast.error('Failed to send verification email. Please try again later.');
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center p-4">
      <div className="bg-gray-800 text-white rounded-xl w-full max-w-2xl p-6 relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold mb-6">Account</h2>

        {loading && (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        )}

        {error && <p className="text-red-400">{error}</p>}

        {!loading && !error && profileData && (
          <div>
            {/* Account Info */}
            <div className="flex items-center gap-4">
              <div className="relative group">
                <Avatar
                  size="lg"
                  className="w-16 h-16 text-2xl bg-indigo-500 cursor-pointer"
                  onClick={handleAvatarClick}
                >
                  {profileData.avatar ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL}${profileData.avatar}`}
                      alt={profileData.name}
                      className="w-full h-full rounded-md object-cover"
                    />
                  ) : (
                    profileData.name?.charAt(0) || 'U'
                  )}
                </Avatar>
                <div
                  className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={handleAvatarClick}
                >
                  <Camera className="w-6 h-6" />
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>
              <div className="flex-grow">
                <label className="text-xs text-gray-400">Preferred name</label>
                {isEditingUsername ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="bg-gray-700 border border-gray-600 rounded-md px-3 py-1 w-full"
                    />
                    <button
                      onClick={handleUsernameSave}
                      className="p-2 rounded-md bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="text-lg">{profileData.name}</p>
                    <button
                      onClick={() => setIsEditingUsername(true)}
                      className="text-gray-400 hover:text-white"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Account Security */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold">Account security</h3>
              <div className="mt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p>Email</p>
                    <p className="text-sm text-gray-400">{profileData.email}</p>
                  </div>
                  {profileData.email_verified ? (
                    Verified
                  ) : (
                    <button
                      className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-md text-sm cursor-pointer"
                      onClick={handleVerifyEmail}
                    >
                      Verify email
                    </button>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p>Password</p>
                    <p className="text-sm text-gray-400">
                      Set a permanent password to login to your account.
                    </p>
                  </div>
                  <button className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-md text-sm">
                    Add password
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileModal;
