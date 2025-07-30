import { useState } from 'react';
import { MOCK_RECENT_PAGES } from '../utils/mockData';

export const usePages = () => {
  const [recentPages] = useState(MOCK_RECENT_PAGES);
  
  return { recentPages };
};