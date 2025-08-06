import api from '../utils/api'; // Assuming api is in utils/api.js

// Function to send verification code to user's email
const sendVerificationCode = async (email) => {
  const data = { email }; // Input data containing the email
  try {
    const response = await api.post({
      endpoint: '/auth/send-verification-code', // API endpoint for sending code
      data, // Send email data
    });
    console.log('Verification code sent:', response);
    return response; // You can return the response if needed
  } catch (error) {
    console.error('Error sending verification code:', error);
    throw error; // Re-throw error to handle it later
  }
};

// Function to verify code and register the user
const verifyCodeAndRegister = async (email, code) => {
  const data = { email, code }; // Send email and code together in the body
  try {
    console.log(data);
    const response = await api.post({
      endpoint: '/auth/verify-code-and-register',
      data, // Send the data object correctly
    });
    console.log('User registered successfully:', response);

    // Save tokens to localStorage
    if (response && response.tokens) {
      localStorage.setItem('accessToken', response.tokens.accessToken);
      localStorage.setItem('refreshToken', response.tokens.refreshToken);
    }

    return response;
  } catch (error) {
    console.error('Error verifying code and registering:', error);
    throw error;
  }
};

const registerUser = async ({ email, name, password }) => {
  const data = { email, name, password };
  try {
    const response = await api.post({
      endpoint: '/auth/register',
      data,
    });
    return response;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

const loginUser = async ({ email, password }) => {
  const data = { email, password };
  try {
    const response = await api.post({
      endpoint: '/auth/login',
      data,
    });
    console.log(response);
    return response;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

const logoutUser = async () => {
  try {
    const response = await api.post({
      endpoint: '/auth/logout',
    });
    return response;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

const getCurrentUserApi = async () => {
  try {
    const response = await api.get({
      endpoint: '/auth/get-current-user',
    });
    return response;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

const sendEmailVerification = async () => {
  try {
    const response = await api.post({
      endpoint: '/auth/send-verification',
    });
    return response;
  } catch (error) {
    console.error('Error sending email verification:', error);
    throw error;
  }
};

const verifyEmail = async (token) => {
  try {
    const response = await api.get({
      endpoint: `/auth/verify-email?token=${token}`,
    });
    return response;
  } catch (error) {
    console.error('Error verifying email:', error);
    throw error;
  }
};

export {
  sendVerificationCode,
  verifyCodeAndRegister,
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUserApi,
  sendEmailVerification,
  verifyEmail,
};
