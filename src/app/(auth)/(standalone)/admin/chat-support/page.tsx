'use client';

import { useEffect, useState } from 'react';
import { AuthProvider } from '@/hooks/useAuth';
import { WhatsAppRepoProvider } from '@/hooks/useWhatsAppRepository';
import WorkspaceLayout from '@/components/chat-support/WorkspaceLayout';
import { mockUser } from '@/data/mockWhatsApp';
import { DevToolbar } from '@/components/chat-support/DevToolbar';

export default function WorkspacePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Server renders nothing, client will show this briefly before mounting
    return null;
  }

  return (
    <AuthProvider user={mockUser}>
      <WhatsAppRepoProvider>
        <div className="h-screen w-screen bg-background text-foreground flex flex-col">
          <WorkspaceLayout />
          {process.env.NODE_ENV === 'development' && <DevToolbar />}
        </div>
      </WhatsAppRepoProvider>
    </AuthProvider>
  );
}