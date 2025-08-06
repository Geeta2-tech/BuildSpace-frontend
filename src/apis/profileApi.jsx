import api from '../utils/api';

const getProfile = async (userId) => {
  try {
    // No changes needed for GET requests
    const response = await api.get({
      endpoint: `/profile/get-user-profile?userId=${userId}`,
    });
    return response;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

const createAvatar = async (userId, avatarFile) => {
  try {
    // **MODIFICATION**: Create a FormData object
    const formData = new FormData();
    // 'avatar' is the key the backend will look for. The second argument is the file itself.
    formData.append('avatar', avatarFile);

    const response = await api.post({
      endpoint: `/profile/upload-avatar?userId=${userId}`,
      data: formData, // Pass the FormData object directly
    });
    return response;
  } catch (error) {
    console.error('Error creating avatar:', error);
    throw error;
  }
};

const updateUsername = async (userId, newUsername) => {
  try {
    // No changes needed for simple JSON PUT requests
    const response = await api.put({
      endpoint: `/profile/update-username?userId=${userId}`,
      data: { name: newUsername },
    });
    return response;
  } catch (error) {
    console.error('Error updating username:', error);
    throw error;
  }
};

export { getProfile, createAvatar, updateUsername };
