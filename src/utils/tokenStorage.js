import { jwtDecode } from 'jwt-decode';

export const getUserFromToken = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    console.log(decoded);
    return decoded; // contains userId, email, username etc.
  } catch (err) {
    console.error('Invalid token:', err);
    return null;
  }
};
