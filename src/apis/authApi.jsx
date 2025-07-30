import api from './utils/api'; // Assuming api is in utils/api.js

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
  const data = { email, code }; // Input data containing email and verification code
  
  try {
    const response = await api.post({
      endpoint: '/auth/verify-code-and-register', // API endpoint to verify and register
      email,
      code, // Send email and code data
    });
    console.log('User registered successfully:', response);
    return response; // You can return the response if needed
  } catch (error) {
    console.error('Error verifying code and registering:', error);
    throw error; // Re-throw error to handle it later
  }
};

export { sendVerificationCode, verifyCodeAndRegister };
