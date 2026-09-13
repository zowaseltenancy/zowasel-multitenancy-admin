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
  /** Re-render consumers after a direct repo write that bypassed `mutate`. */
  refresh: () => void;
  /**
   * Dependency for effects that must re-read from the repo. Tracks `version`,
   * so it changes on every write and not only on a reset — ConversationView
   * keys its message reload off this, and a simulated incoming message would
   * otherwise never appear.
   */
  resetTrigger: number;
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

  // Same version bump as `mutate`, for callers that wrote through `repo`
  // directly and just need the tree to re-read.
  const refresh = useCallback(() => {
    setVersion(v => v + 1);
  }, []);

  const resetData = useCallback(() => {
    repoRef.current.resetDB(seedDB);
    setVersion(v => v + 1);
  }, []);

  const value = useMemo(
    () => ({
      repo: repoRef.current,
      version,
      ready,
      mutate,
      resetData,
      refresh,
      resetTrigger: version,
    }),
    [version, ready, mutate, resetData, refresh]
  );

  return <WhatsAppRepoContext.Provider value={value}>{children}</WhatsAppRepoContext.Provider>;
};

export const useWhatsAppRepo = () => {
  const ctx = useContext(WhatsAppRepoContext);
  if (!ctx) throw new Error('useWhatsAppRepo must be used within WhatsAppRepoProvider');
  return ctx;
};