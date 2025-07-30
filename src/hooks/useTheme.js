import { useState } from 'react';

export const useTheme = () => {
  const [theme, setTheme] = useState('dark');
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };
  
  return { theme, toggleTheme };
};