import { ChannelConnectionStatus } from "@/types/marketing";

export const mockConnections: ChannelConnectionStatus[] = [
  {
    channel: "sms",
    connected: true,
    sessionName: "Zowasel SMS Gateway — MTN NG",
    lastConnectedAt: "2026-07-31T06:00:00Z",
  },
  {
    channel: "whatsapp",
    connected: false,
    sessionName: "Zowasel WhatsApp Business",
    lastConnectedAt: "2026-07-29T18:30:00Z",
  },
];
