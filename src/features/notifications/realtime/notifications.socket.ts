"use client";

import { io, Socket } from "socket.io-client";

import { getAdminAccessToken } from "@/lib/auth-session";
import { NotificationDto } from "../api/notifications.api";

// The live half of the notification feed.
//
// The REST endpoints answer "what is in my feed"; this answers "something just
// happened". Without it the console would have to poll — a request every few
// seconds per open tab, almost always to be told nothing changed, and still up
// to one interval behind.
//
// Connected straight to notification-service rather than through the Next
// rewrite: a rewrite proxies HTTP, and the websocket upgrade does not survive
// it reliably. The service allows this origin explicitly (SOCKET_CORS_ORIGINS).

const SOCKET_URL =
  process.env.NEXT_PUBLIC_NOTIFICATIONS_SOCKET_URL ?? "http://localhost:4002";

export const NOTIFICATION_EVENTS = {
  CREATED: "notification:created",
  UNREAD_COUNT: "notification:unread-count",
} as const;

export interface NotificationSocketHandlers {
  onCreated?: (notification: NotificationDto) => void;
  onUnreadCount?: (count: number) => void;
  onStatusChange?: (connected: boolean) => void;
}

/**
 * One shared socket for the whole tab.
 *
 * The bell in the header and the notifications page both subscribe; opening a
 * connection per component would mean several sockets per tab, each with its
 * own reconnect loop, all delivering the same events.
 */
let socket: Socket | null = null;
let refCount = 0;

function createSocket(): Socket {
  return io(SOCKET_URL, {
    path: "/socket.io",
    // The access token is read at connect time and again on every reconnect
    // attempt, because it rotates: a socket that cached the token it started
    // with would fail to reauthenticate after the first refresh and then sit
    // there retrying with a credential that can no longer work.
    auth: (cb) => cb({ token: getAdminAccessToken() ?? "" }),
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 10000,
    // Not Infinity: a tab left open against a service that is never coming
    // back should eventually stop, rather than retry for days.
    reconnectionAttempts: 20,
    autoConnect: true,
  });
}

/**
 * Subscribe to live notifications. Returns an unsubscribe function.
 *
 * The socket is shared and reference-counted: it is opened on the first
 * subscriber and closed when the last one goes away, so navigating between
 * pages does not leave connections behind.
 */
export function subscribeToNotifications(handlers: NotificationSocketHandlers): () => void {
  if (!socket) socket = createSocket();
  refCount += 1;

  const current = socket;

  const onCreated = (payload: NotificationDto) => handlers.onCreated?.(payload);
  const onUnread = (payload: { count: number }) => handlers.onUnreadCount?.(payload.count);
  const onConnect = () => handlers.onStatusChange?.(true);
  const onDisconnect = () => handlers.onStatusChange?.(false);

  current.on(NOTIFICATION_EVENTS.CREATED, onCreated);
  current.on(NOTIFICATION_EVENTS.UNREAD_COUNT, onUnread);
  current.on("connect", onConnect);
  current.on("disconnect", onDisconnect);
  // A rejected handshake (expired or missing token) arrives here. Reported as
  // a disconnection rather than thrown: the feed still works over REST, and
  // the next reconnect picks up a refreshed token.
  current.on("connect_error", onDisconnect);

  if (current.connected) handlers.onStatusChange?.(true);

  return () => {
    current.off(NOTIFICATION_EVENTS.CREATED, onCreated);
    current.off(NOTIFICATION_EVENTS.UNREAD_COUNT, onUnread);
    current.off("connect", onConnect);
    current.off("disconnect", onDisconnect);
    current.off("connect_error", onDisconnect);

    refCount = Math.max(0, refCount - 1);
    if (refCount === 0) {
      current.disconnect();
      if (socket === current) socket = null;
    }
  };
}

/** For sign-out: drop the connection and its credential immediately. */
export function closeNotificationSocket(): void {
  if (!socket) return;
  socket.disconnect();
  socket = null;
  refCount = 0;
}
