// components/FloatingChatButton.tsx
import { MessageCircle } from 'lucide-react';

export function FloatingChatButton() {
  return (
    <a
      href="/admin/chat-support"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      aria-label="Open chat support"
    >
      <MessageCircle className="h-6 w-6" />
      {/* Optional: add an unread indicator */}
      <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
        3
      </span>
    </a>
  );
}