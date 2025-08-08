import { useEffect, useState, useCallback } from 'react';
import api from '../utils/api';

export const usePages = (workspaceId) => {
  const [recentPages, setRecentPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPages = useCallback(async () => {
    if (!workspaceId) return;

    try {
      setLoading(true);
      const response = await api.get({
        endpoint: '/page/get-all',
        params: { workspaceId },
      });

      setRecentPages(response.pages || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching pages:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  // Refetch function that can be called from components
  const refetchPages = useCallback(() => {
    if (workspaceId) {
      fetchPages();
    }
  }, [fetchPages, workspaceId]);

  // Function to remove a page from local state (for immediate UI updates)
  const removePageFromState = useCallback((pageId) => {
    setRecentPages(prevPages => prevPages.filter(page => page.id !== pageId));
  }, []);

  // Function to add a page to local state (for immediate UI updates)
  const addPageToState = useCallback((newPage) => {
    setRecentPages(prevPages => [newPage, ...prevPages]);
  }, []);

  // Function to update a page in local state (for immediate UI updates)
  const updatePageInState = useCallback((pageId, updatedData) => {
    setRecentPages(prevPages => 
      prevPages.map(page => 
        page.id === pageId ? { ...page, ...updatedData } : page
      )
    );
  }, []);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  return { 
    recentPages, 
    loading, 
    error, 
    refetchPages,
    removePageFromState,
    addPageToState,
    updatePageInState
  };
};