'use client';

import React, { createContext, useContext, useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { WhatsAppRepository } from '@/lib/whatsappRepository';
import { seedDB } from '@/data/mockWhatsApp';

interface ContextValue {
  repo: WhatsAppRepository;
  version: number;
  ready: boolean;
  mutate: <T>(fn: (repo: WhatsAppRepository) => T) => T;
  resetData: () => void;
}

const WhatsAppRepoContext = createContext<ContextValue | null>(null);

export const WhatsAppRepoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const repoRef = useRef<WhatsAppRepository>(new WhatsAppRepository());
  const [version, setVersion] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    repoRef.current.init(seedDB);
    setReady(true);
    setVersion(v => v + 1);
  }, []);

  // Every write goes through this. Bumping version is not optional.
  const mutate = useCallback(<T,>(fn: (repo: WhatsAppRepository) => T): T => {
    const result = fn(repoRef.current);
    setVersion(v => v + 1);
    return result;
  }, []);

  const resetData = useCallback(() => {
    repoRef.current.resetDB(seedDB);
    setVersion(v => v + 1);
  }, []);

  const value = useMemo(
    () => ({ repo: repoRef.current, version, ready, mutate, resetData }),
    [version, ready, mutate, resetData]
  );

  return <WhatsAppRepoContext.Provider value={value}>{children}</WhatsAppRepoContext.Provider>;
};

export const useWhatsAppRepo = () => {
  const ctx = useContext(WhatsAppRepoContext);
  if (!ctx) throw new Error('useWhatsAppRepo must be used within WhatsAppRepoProvider');
  return ctx;
};