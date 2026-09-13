'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useWhatsAppRepo } from '@/hooks/useWhatsAppRepository';
import { injectIncoming } from '@/lib/simulationEngine';

interface SimulationContextValue {
  /** The chat the dev toolbar acts on. Set by WorkspaceLayout on selection. */
  targetChatId: string | null;
  setTargetChatId: (id: string | null) => void;
  /** Contact ids currently "typing". Ephemeral, never persisted. */
  typingContactIds: string[];
  setTyping: (contactId: string, isTyping: boolean) => void;
  autoIncoming: boolean;
  setAutoIncoming: (on: boolean) => void;
}

const SimulationContext = createContext<SimulationContextValue | null>(null);

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { repo, mutate } = useWhatsAppRepo();
  const [targetChatId, setTargetChatId] = useState<string | null>(null);
  const [typingContactIds, setTypingContactIds] = useState<string[]>([]);
  const [autoIncoming, setAutoIncoming] = useState(false);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const setTyping = useCallback((contactId: string, isTyping: boolean) => {
    setTypingContactIds((prev) =>
      isTyping
        ? prev.includes(contactId)
          ? prev
          : [...prev, contactId]
        : prev.filter((id) => id !== contactId),
    );

    clearTimeout(timers.current[contactId]);
    if (isTyping) {
      // Auto-clear so a forgotten toggle doesn't leave a permanent "typing…".
      timers.current[contactId] = setTimeout(() => {
        setTypingContactIds((prev) => prev.filter((id) => id !== contactId));
      }, 6000);
    }
  }, []);

  useEffect(() => {
    if (!autoIncoming || !targetChatId) return;
    const interval = setInterval(() => {
      // No filter: the simulator just needs to find the target chat by id.
      const chats = repo.getConversations();
      const chat = chats.find((c) => c.id === targetChatId);
      if (!chat) return;
      mutate((r) => injectIncoming(r, chat.id, chat.contactId, 'text'));
    }, 8000);
    return () => clearInterval(interval);
  }, [autoIncoming, targetChatId, repo, mutate]);

  useEffect(() => {
    const t = timers.current;
    return () => Object.values(t).forEach(clearTimeout);
  }, []);

  const value = useMemo(
    () => ({
      targetChatId,
      setTargetChatId,
      typingContactIds,
      setTyping,
      autoIncoming,
      setAutoIncoming,
    }),
    [targetChatId, typingContactIds, setTyping, autoIncoming],
  );

  return (
    <SimulationContext.Provider value={value}>{children}</SimulationContext.Provider>
  );
};

export function useSimulation(): SimulationContextValue {
  const ctx = useContext(SimulationContext);
  if (!ctx) {
    // Simulation is dev-only. In production the provider is absent and callers
    // get a harmless no-op rather than a crash.
    return {
      targetChatId: null,
      setTargetChatId: () => {},
      typingContactIds: [],
      setTyping: () => {},
      autoIncoming: false,
      setAutoIncoming: () => {},
    };
  }
  return ctx;
}