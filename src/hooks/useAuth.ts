'use client';

import { useContext, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { fetcher } from '@/lib/fetcher';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  // This effect updates the fetcher's token whenever the user changes.
  useEffect(() => {
    if (context.user) {
      context.getAuthToken().then(token => {
        if (token) {
          fetcher.setAuthToken(token);
        }
      });
    } else {
      fetcher.setAuthToken(null);
    }
  }, [context.user, context.getAuthToken]);

  return context;
};
