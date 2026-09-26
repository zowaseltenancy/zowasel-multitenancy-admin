import { notifClient } from "@/lib/axios";
import { ApiResponse } from "@/lib/api-response";
import {
  NotificationCategory,
  NotificationSeverity,
  PlatformNotification,
} from "@/types/notification";

// GET/PATCH/POST against notification-service. New notifications also arrive
// over Socket.IO (see ../realtime/notifications.socket); these calls are the
// initial load, the history, and the fallback when the socket is down.

/** The wire shape — upper-case enums, as the service stores them. */
export interface NotificationDto {
  id: string;
  category: "KYB" | "MODULE" | "SECURITY" | "BILLING";
  severity: "INFO" | "WARNING" | "CRITICAL";
  title: string;
  message: string;
  resourceType: string | null;
  resourceId: string | null;
  organizationId: string | null;
  organizationName: string | null;
  actorName: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationListResult {
  items: PlatformNotification[];
  unread: number;
  total: number;
  page: number;
  totalPages: number;
}

export interface NotificationListQuery {
  page?: number;
  limit?: number;
  category?: NotificationCategory;
  unreadOnly?: boolean;
}

const CATEGORY_TO_UI: Record<NotificationDto["category"], NotificationCategory> = {
  KYB: "kyb",
  MODULE: "module",
  SECURITY: "security",
  BILLING: "billing",
};

const SEVERITY_TO_UI: Record<NotificationDto["severity"], NotificationSeverity> = {
  INFO: "info",
  WARNING: "warning",
  CRITICAL: "critical",
};

/** The console's union is lower case; the service's enum is upper. */
export function mapNotification(dto: NotificationDto): PlatformNotification {
  return {
    id: dto.id,
    category: CATEGORY_TO_UI[dto.category] ?? "security",
    severity: SEVERITY_TO_UI[dto.severity] ?? "info",
    title: dto.title,
    message: dto.message,
    ...(dto.organizationId ? { organizationId: dto.organizationId } : {}),
    ...(dto.organizationName ? { organizationName: dto.organizationName } : {}),
    ...(dto.actorName ? { actorName: dto.actorName } : {}),
    isRead: dto.isRead,
    createdAt: dto.createdAt,
  };
}

/** The reverse, for the category filter the pages pass down. */
export function toApiCategory(category: NotificationCategory): NotificationDto["category"] {
  return category.toUpperCase() as NotificationDto["category"];
}

export const notificationKeys = {
  all: ["notifications"] as const,
  list: (params: NotificationListQuery) => [...notificationKeys.all, "list", params] as const,
  unreadCount: () => [...notificationKeys.all, "unread-count"] as const,
};

export const notificationsApi = {
  async list(params: NotificationListQuery = {}): Promise<NotificationListResult> {
    const { data } = await notifClient.get<
      ApiResponse<{ items: NotificationDto[]; unread: number }>
    >("/notifications", {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 50,
        ...(params.category ? { category: toApiCategory(params.category) } : {}),
        ...(params.unreadOnly ? { unreadOnly: true } : {}),
      },
    });

    return {
      items: (data.data?.items ?? []).map(mapNotification),
      unread: data.data?.unread ?? 0,
      total: data.meta?.total ?? data.data?.items?.length ?? 0,
      page: data.meta?.page ?? 1,
      totalPages: data.meta?.totalPages ?? 1,
    };
  },

  async unreadCount(): Promise<number> {
    const { data } = await notifClient.get<ApiResponse<{ count: number }>>(
      "/notifications/unread-count",
    );
    return data.data?.count ?? 0;
  },

  /** Idempotent server-side; marking an already-read notification is fine. */
  async markRead(id: string): Promise<{ unread: number }> {
    const { data } = await notifClient.patch<ApiResponse<{ unread: number }>>(
      `/notifications/${id}/read`,
    );
    return { unread: data.data?.unread ?? 0 };
  },

  /** Unread is the absence of a read record, so this deletes one. */
  async markUnread(id: string): Promise<{ unread: number }> {
    const { data } = await notifClient.delete<ApiResponse<{ unread: number }>>(
      `/notifications/${id}/read`,
    );
    return { unread: data.data?.unread ?? 0 };
  },

  /**
   * Marks everything read, or just one category — the per-category pages need
   * the button to clear what is on screen, not the whole feed.
   */
  async markAllRead(category?: NotificationCategory): Promise<{ marked: number; unread: number }> {
    const { data } = await notifClient.post<ApiResponse<{ marked: number; unread: number }>>(
      "/notifications/read-all",
      category ? { category: toApiCategory(category) } : {},
    );
    return { marked: data.data?.marked ?? 0, unread: data.data?.unread ?? 0 };
  },
};
