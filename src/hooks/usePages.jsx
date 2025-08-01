import { useEffect, useState } from 'react';
import api from '../utils/api';

export const usePages = (workspaceId) => {
  const [recentPages, setRecentPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPages = async () => {
      if (!workspaceId) return;

      try {
        const response = await api.get({
          endpoint: '/page/get-all',
          params: { workspaceId },
        });

        setRecentPages(response.pages || []);
      } catch (err) {
        console.error('Error fetching pages:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, [workspaceId]);

  return { recentPages, loading, error };
};
