"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/axios";
import { PlatformNotification } from "@/types/notification";
import {
  mapNotification,
  NotificationDto,
  notificationKeys,
  NotificationListQuery,
  NotificationListResult,
  notificationsApi,
} from "../api/notifications.api";
import { subscribeToNotifications } from "../realtime/notifications.socket";

// Backed by notification-service, live over Socket.IO.
//
// This hook used to hold `useState(mockNotifications)` — every "mark as read"
// was an edit to an array in one browser tab, gone on refresh, and the bell
// showed the same fixture to everyone. Nothing here had reached a server.
//
// Two sources now, and they have to agree:
//
//   * the REST list, which is the feed's history and the state on first paint;
//   * the socket, which delivers what arrives while the page is open.
//
// A push updates the cached list directly rather than triggering a refetch —
// the row is already in hand, and refetching per notification would turn a
// burst of events into a burst of requests.

const DEFAULT_QUERY: NotificationListQuery = { page: 1, limit: 50 };

export function useNotifications(params: NotificationListQuery = DEFAULT_QUERY) {
  const queryClient = useQueryClient();
  const [isLive, setIsLive] = useState(false);

  // Callers pass object literals — `useNotifications({ limit: 20 })` is a new
  // object on every render. Depending on it directly would tear down and
  // rebuild the socket subscription each time, so the identity that matters is
  // the serialised value, not the reference.
  const paramsKey = JSON.stringify(params);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stableParams = useMemo(() => params, [paramsKey]);

  const query = useQuery({
    queryKey: notificationKeys.list(stableParams),
    queryFn: () => notificationsApi.list(stableParams),
  });

  /**
   * Fold a live notification into the cached page.
   *
   * Guarded against duplicates: a reconnect can redeliver, and the same id
   * appearing twice would render two rows and double the unread count.
   */
  const applyIncoming = useCallback(
    (dto: NotificationDto) => {
      const incoming: PlatformNotification = mapNotification(dto);

      queryClient.setQueryData<NotificationListResult>(
        notificationKeys.list(stableParams),
        (current) => {
          if (!current) return current;
          if (current.items.some((n) => n.id === incoming.id)) return current;

          return {
            ...current,
            items: [incoming, ...current.items],
            unread: current.unread + 1,
            total: current.total + 1,
          };
        },
      );
    },
    [queryClient, stableParams],
  );

  useEffect(() => {
    const unsubscribe = subscribeToNotifications({
      onCreated: applyIncoming,
      // The server recomputes the unread total after any read, which keeps the
      // badge right when the same account reads a notification in another tab.
      onUnreadCount: (count) => {
        queryClient.setQueryData<NotificationListResult>(
          notificationKeys.list(stableParams),
          (current) => (current ? { ...current, unread: count } : current),
        );
      },
      onStatusChange: setIsLive,
    });

    return unsubscribe;
  }, [applyIncoming, queryClient, stableParams]);

  // ── Writes ─────────────────────────────────────────────────────────────────
  // Each one patches the cached list so the row changes under the cursor, then
  // leaves the server's own unread total to arrive over the socket.

  const setReadLocally = (id: string, isRead: boolean) => {
    queryClient.setQueryData<NotificationListResult>(
      notificationKeys.list(stableParams),
      (current) =>
        current
          ? {
              ...current,
              items: current.items.map((n) => (n.id === id ? { ...n, isRead } : n)),
            }
          : current,
    );
  };

  const readMutation = useMutation({
    mutationFn: (id: string) => notificationsApi.markRead(id),
    onError: (error, id) => {
      // Put the row back: the click already moved it, and leaving it read
      // would be a lie about what the server holds.
      setReadLocally(id, false);
      toast.error(getApiErrorMessage(error, "Could not mark that as read."));
    },
  });

  const unreadMutation = useMutation({
    mutationFn: (id: string) => notificationsApi.markUnread(id),
    onError: (error, id) => {
      setReadLocally(id, true);
      toast.error(getApiErrorMessage(error, "Could not mark that as unread."));
    },
  });

  const allReadMutation = useMutation({
    // Scoped to whatever category this hook is filtered to, so the button
    // clears the page the operator is on rather than the entire feed.
    mutationFn: () => notificationsApi.markAllRead(stableParams.category),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
    onError: (error) => {
      void queryClient.invalidateQueries({ queryKey: notificationKeys.all });
      toast.error(getApiErrorMessage(error, "Could not mark everything as read."));
    },
  });

  const notifications = query.data?.items ?? [];

  const markAsRead = (id: string) => {
    if (notifications.find((n) => n.id === id)?.isRead) return;
    setReadLocally(id, true);
    readMutation.mutate(id);
  };

  /** Both directions, which is why the service grew a DELETE for the read row. */
  const toggleReadStatus = (id: string) => {
    const current = notifications.find((n) => n.id === id);
    if (!current) return;

    setReadLocally(id, !current.isRead);
    if (current.isRead) unreadMutation.mutate(id);
    else readMutation.mutate(id);
  };

  const markAllAsRead = () => {
    queryClient.setQueryData<NotificationListResult>(
      notificationKeys.list(stableParams),
      (cached) =>
        cached
          ? { ...cached, items: cached.items.map((n) => ({ ...n, isRead: true })), unread: 0 }
          : cached,
    );
    allReadMutation.mutate();
  };

  return {
    notifications,
    unreadCount: query.data?.unread ?? notifications.filter((n) => !n.isRead).length,
    isLoading: query.isLoading,
    error: query.error ? getApiErrorMessage(query.error, "Unable to load notifications.") : null,
    /** Whether the socket is currently connected — for a "live" indicator. */
    isLive,
    markAsRead,
    toggleReadStatus,
    markAllAsRead,
  };
}
