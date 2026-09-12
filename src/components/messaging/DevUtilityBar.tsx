"use client";
import { useState } from 'react';
import { Zap, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WhatsAppRepository } from '@/lib/whatsapp/repository';

export default function DevUtilityBar({
  open,
  onClose,
  repo,
  conversationId,
  onUpdate,
}: {
  open: boolean;
  onClose: () => void;
  repo: WhatsAppRepository;
  conversationId: string | null;
  onUpdate: () => void;
}) {
  if (!open) return null;

  const actions = [
    { label: 'Incoming text', run: () => repo.simulateIncoming(conversationId!, 'Hey, quick question...') },
    { label: 'Incoming image', run: () => repo.simulateIncoming(conversationId!, '', 'image', { fileName: 'proof.jpg' }) },
    { label: 'Incoming voice', run: () => repo.simulateIncoming(conversationId!, '', 'voice', { duration: 8 }) },
    { label: 'Incoming location', run: () => repo.simulateIncoming(conversationId!, '', 'location', { lat: 6.5, lng: 3.3, label: 'Farm site' }) },
    {
      label: 'Mark last as delivered',
      run: () => {
        const msgs = repo.getMessages(conversationId!);
        if (msgs.length) repo.updateMessageStatus(msgs[msgs.length - 1].id, 'delivered');
      },
    },
    {
      label: 'Mark last as read',
      run: () => {
        const msgs = repo.getMessages(conversationId!);
        if (msgs.length) repo.updateMessageStatus(msgs[msgs.length - 1].id, 'read');
      },
    },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-card border rounded-lg shadow-lg w-72">
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-2 font-semibold text-sm">
          <Zap className="h-4 w-4 text-amber-500" /> Dev Simulation
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>
      </div>
      <div className="p-2 space-y-1">
        {actions.map((a) => (
          <Button
            key={a.label}
            variant="ghost"
            size="sm"
            className="w-full justify-start text-xs"
            disabled={!conversationId}
            onClick={() => {
              a.run();
              onUpdate();
            }}
          >
            {a.label}
          </Button>
        ))}
      </div>
    </div>
  );
}