"use client";

import { useState } from "react";
import { ChannelConnectionStatus } from "@/types/marketing";
import { mockConnections } from "../data/mockConnections";

export function useConnections() {
  const [connections, setConnections] = useState<ChannelConnectionStatus[]>(mockConnections);

  const reconnect = (channel: "sms" | "whatsapp") => {
    setConnections((current) =>
      current.map((connection) =>
        connection.channel === channel
          ? { ...connection, connected: true, lastConnectedAt: new Date().toISOString() }
          : connection
      )
    );
  };

  return { connections, reconnect };
}
