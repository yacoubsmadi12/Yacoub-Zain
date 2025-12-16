'use client';

import { createContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, getIdToken } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import type { AppUser, UserProfile } from '@/types';
import { getUserProfile } from '@/lib/firebase/firestore';


interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  refreshUserProfile: () => void;
  getAuthToken: () => Promise<string | null>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refreshUserProfile: () => {},
  getAuthToken: async () => null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const getAuthToken = async (): Promise<string | null> => {
    if (auth?.currentUser) {
        return await getIdToken(auth.currentUser);
    }
    return null;
  }

  const refreshUserProfile = async () => {
    if (user) {
      try {
        const profile = await getUserProfile(user.uid);
        if (profile) {
          setUser(prevUser => prevUser ? { ...prevUser, profile } : null);
        }
      } catch (error) {
        console.error("Error refreshing user profile:", error);
      }
    }
  }

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const profile = await getUserProfile(firebaseUser.uid);
          const appUser: AppUser = {
            ...firebaseUser,
            profile: profile || undefined,
          };
          setUser(appUser);
        } catch (error) {
          console.error("Error fetching user profile:", error);
          const appUser: AppUser = {
            ...firebaseUser,
            profile: undefined,
          };
          setUser(appUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refreshUserProfile, getAuthToken }}>
      {children}
    </AuthContext.Provider>
  );
};
