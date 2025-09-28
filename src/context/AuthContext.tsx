'use client';

import { createContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import type { AppUser, UserProfile } from '@/types';
import { getUserProfileAction } from '@/app/actions/get-user-profile-action';


interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  refreshUserProfile: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refreshUserProfile: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUserProfile = async () => {
    if (user) {
      const profile = await getUserProfileAction(user.uid);
      if (profile) {
        setUser(prevUser => prevUser ? { ...prevUser, profile } : null);
      }
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await getUserProfileAction(firebaseUser.uid);
        const appUser: AppUser = {
          ...firebaseUser,
          profile: profile || undefined,
        };
        setUser(appUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refreshUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
