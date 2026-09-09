import { Message, MessageType } from "@/types/whatsapp";
import { WhatsAppRepository } from "@/lib/whatsappRepository";

// Dev-only simulation helper. This file was imported by useSimulation but
// committed empty, so the module was unresolvable and the whole chat-support
// tree failed to compile.
//
// `injectIncoming` fabricates an inbound message — one the contact "sent" —
// and stores it through the repository's normal write path, so a simulated
// message is indistinguishable in storage from a real one and the existing
// unread/ordering logic applies unchanged.
//
// Only reachable from the DevToolbar, which itself renders solely when
// NODE_ENV === 'development'.

const SIMULATED_BODIES: Record<string, string> = {
  text: "Hello, I have a question about my order.",
};

export function injectIncoming(
  repo: WhatsAppRepository,
  chatId: string,
  contactId: string,
  type: MessageType = "text",
): Message {
  const message: Message = {
    id: `sim-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    chatId,
    // The contact is the sender: that is what makes this "incoming" rather
    // than a message from the agent.
    senderId: contactId,
    timestamp: new Date().toISOString(),
    type,
    body: SIMULATED_BODIES[type] ?? SIMULATED_BODIES.text,
    // Inbound messages arrive already delivered; there is no send to await.
    status: "delivered",
  };

  repo.sendMessage(message);
  return message;
}
