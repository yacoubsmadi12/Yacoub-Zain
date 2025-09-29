'use client';

import { createContext, useState, useContext, ReactNode, Dispatch, SetStateAction } from 'react';

interface ProgressUpdateContextType {
  progressUpdated: boolean;
  setProgressUpdated: Dispatch<SetStateAction<boolean>>;
}

const ProgressUpdateContext = createContext<ProgressUpdateContextType | undefined>(undefined);

export const ProgressUpdateProvider = ({ children }: { children: ReactNode }) => {
  const [progressUpdated, setProgressUpdated] = useState(false);

  return (
    <ProgressUpdateContext.Provider value={{ progressUpdated, setProgressUpdated }}>
      {children}
    </ProgressUpdateContext.Provider>
  );
};

export const useProgressUpdate = () => {
  const context = useContext(ProgressUpdateContext);
  if (context === undefined) {
    throw new Error('useProgressUpdate must be used within a ProgressUpdateProvider');
  }
  return context;
};
