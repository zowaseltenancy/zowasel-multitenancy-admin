'use client';
import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { StaffRepository } from '@/lib/staffRepository';

interface StaffContextValue {
  repo: StaffRepository;
  refresh: () => void;
}

const StaffContext = createContext<StaffContextValue | null>(null);

export const StaffProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const repoRef = useRef(new StaffRepository());
  const [, forceRender] = useState(0);

  useEffect(() => {
    repoRef.current.init();
    forceRender(n => n + 1);
  }, []);

  const refresh = useCallback(() => forceRender(n => n + 1), []);

  return (
    <StaffContext.Provider value={{ repo: repoRef.current, refresh }}>
      {children}
    </StaffContext.Provider>
  );
};

export const useStaff = () => {
  const ctx = useContext(StaffContext);
  if (!ctx) throw new Error('useStaff must be used within StaffProvider');
  return ctx;
};