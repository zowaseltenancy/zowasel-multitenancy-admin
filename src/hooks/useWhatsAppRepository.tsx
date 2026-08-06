import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { WhatsAppRepository } from '@/lib/whatsappRepository';
import { seedDB } from '@/data/mockWhatsApp';

interface ContextValue {
  repo: WhatsAppRepository;
  refresh: () => void;
  resetTrigger: number;
  resetData: () => void;
}

const WhatsAppRepoContext = createContext<ContextValue | null>(null);

export const WhatsAppRepoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const repoRef = useRef<WhatsAppRepository>(new WhatsAppRepository());
  const [, forceRender] = useState(0);
  const [resetTrigger, setResetTrigger] = useState(0);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !hasInitialized.current) {
      repoRef.current.init(seedDB);
      hasInitialized.current = true;
      forceRender(n => n + 1); // trigger re-render after seeding
    }
  }, []);

  const refresh = useCallback(() => forceRender(n => n + 1), []);

  const resetData = useCallback(() => {
    repoRef.current.resetDB(seedDB);
    setResetTrigger(prev => prev + 1);
    refresh();
  }, [refresh]);

  return (
    <WhatsAppRepoContext.Provider value={{ repo: repoRef.current, refresh, resetTrigger, resetData }}>
      {children}
    </WhatsAppRepoContext.Provider>
  );
};

export const useWhatsAppRepo = () => {
  const ctx = useContext(WhatsAppRepoContext);
  if (!ctx) throw new Error('useWhatsAppRepo must be used within WhatsAppRepoProvider');
  return ctx;
};