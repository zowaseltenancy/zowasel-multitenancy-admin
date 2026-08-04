"use client";

import { toast } from "sonner";
import { RefreshCcw, Wifi, WifiOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChannelConnectionStatus } from "@/types/marketing";

interface Props {
  connection: ChannelConnectionStatus;
  onReconnect: (channel: "sms" | "whatsapp") => void;
}

export default function ConnectionStatusCard({ connection, onReconnect }: Props) {
  const handleReconnect = () => {
    onReconnect(connection.channel);
    toast.success(`${connection.sessionName ?? "Session"} reconnected. Scan the QR code in the provider dashboard if prompted.`);
  };

  return (
    <Card className={connection.connected ? "border-emerald-500/20 bg-emerald-500/5" : "border-red-500/30 bg-red-500/5"}>
      <CardContent className="flex items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
              connection.connected
                ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-400"
                : "bg-red-500/15 text-red-600 border-red-500/30 dark:text-red-400"
            }`}
          >
            {connection.connected ? <Wifi className="h-5 w-5" /> : <WifiOff className="h-5 w-5" />}
          </div>
          <div>
            <p className="font-semibold">{connection.sessionName ?? "Session"}</p>
            <p className="text-xs text-muted-foreground">
              {connection.connected
                ? `Connected — last reconnected ${new Date(connection.lastConnectedAt ?? "").toLocaleString()}`
                : `Disconnected since ${new Date(connection.lastConnectedAt ?? "").toLocaleString()}`}
            </p>
          </div>
        </div>

        {!connection.connected && (
          <Button size="sm" className="gap-1.5" onClick={handleReconnect}>
            <RefreshCcw className="h-3.5 w-3.5" />
            Reconnect via QR
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
