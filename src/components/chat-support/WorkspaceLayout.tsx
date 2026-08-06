import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { ConversationView } from './ConversationView';
import { ContextPanel } from './ContextPanel';
import { ContactDrawer } from './ContactDrawer';
import { QuickAddContact } from './QuickAddContact';
import { useWhatsAppRepo } from '@/hooks/useWhatsAppRepository';

export default function WorkspaceLayout() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<'sidebar' | 'chat'>('sidebar');
  const [contextOpen, setContextOpen] = useState(false);
  const [contactDrawerId, setContactDrawerId] = useState<string | null>(null);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const { repo } = useWhatsAppRepo();

  const selectedChat = selectedChatId
    ? repo.getConversations().find((c) => c.id === selectedChatId)
    : null;

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
    setMobileView('chat');
    setContextOpen(false);
    setContactDrawerId(null);
  };

  const handleViewContact = (contactId: string) => {
    setContactDrawerId(contactId);
    setContextOpen(false); // close context if open
  };

  // Close all overlays when clicking on the backdrop
  const closeOverlays = () => {
    setContextOpen(false);
    setContactDrawerId(null);
  };

  return (
    <div className="flex h-full w-full relative">
      {/* Sidebar – exactly as before */}
      <div
        className={`${
          mobileView === 'sidebar' ? 'block' : 'hidden'
        } lg:block w-full lg:w-80 flex-shrink-0 border-r border-border`}
      >
        <Sidebar
          selectedChatId={selectedChatId}
          onSelectChat={handleSelectChat}
          onMobileBack={() => {}}
          onNewContact={() => setShowQuickAdd(true)}
        />
      </div>

      {/* Conversation – now takes all available space (no right panels in flow) */}
      <div
        className={`${
          mobileView === 'chat' ? 'block' : 'hidden'
        } lg:block flex-1 flex flex-col min-w-0`}
      >
        {selectedChat ? (
          <ConversationView
            chat={selectedChat}
            onBack={() => {
              setMobileView('sidebar');
              setSelectedChatId(null);
            }}
            onToggleContext={() => {
              // Toggle context overlay on desktop, or switch mobile view
              if (window.innerWidth < 1024) {
                setMobileView(contextOpen ? 'chat' : 'chat'); // will open via overlay
              }
              setContextOpen(!contextOpen);
              setContactDrawerId(null); // close contact if open
            }}
            contextOpen={contextOpen}
            onViewContact={handleViewContact}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a conversation
          </div>
        )}
      </div>

      {/* ===== Overlay panels (absolute, right‑aligned) ===== */}
      {/* Context panel overlay */}
      <div
        className={`absolute top-0 right-0 h-full w-80 bg-card border-l border-border shadow-xl transform transition-transform duration-300 z-30 ${
          contextOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {selectedChat && (
          <ContextPanel
            chat={selectedChat}
            onClose={() => setContextOpen(false)}
            onViewContact={handleViewContact}
          />
        )}
      </div>

      {/* Contact drawer overlay */}
      <div
        className={`absolute top-0 right-0 h-full w-80 bg-card border-l border-border shadow-xl transform transition-transform duration-300 z-30 ${
          contactDrawerId ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {contactDrawerId && (
          <ContactDrawer
            contactId={contactDrawerId}
            onClose={() => setContactDrawerId(null)}
          />
        )}
      </div>

      {/* Backdrop for overlays (desktop) */}
      {(contextOpen || contactDrawerId) && (
        <div
          className="hidden lg:block absolute inset-0 z-20 bg-black/20"
          onClick={closeOverlays}
        />
      )}

      {/* Mobile sheets (unchanged, but simplified) */}
      {mobileView === 'chat' && contextOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm">
          <div className="w-full h-full bg-card overflow-y-auto p-4">
            <ContextPanel
              chat={selectedChat!}
              onClose={() => setContextOpen(false)}
              onViewContact={handleViewContact}
            />
          </div>
        </div>
      )}
      {mobileView === 'chat' && contactDrawerId && (
        <div className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm">
          <div className="w-full h-full bg-card overflow-y-auto p-4">
            <ContactDrawer
              contactId={contactDrawerId}
              onClose={() => setContactDrawerId(null)}
            />
          </div>
        </div>
      )}

      {/* Quick add contact modal */}
      {showQuickAdd && (
        <QuickAddContact
          onClose={() => setShowQuickAdd(false)}
          onContactCreated={(id) => {
            // Optionally select the new chat
          }}
        />
      )}
    </div>
  );
}