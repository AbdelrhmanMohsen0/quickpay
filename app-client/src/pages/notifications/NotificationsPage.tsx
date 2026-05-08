import { useEffect, useState, useRef, useCallback } from "react";
import {
  ArrowLeft,
  Loader2,
  UserPlus,
  ArrowUpRight,
  ArrowDownLeft,
  XCircle,
  Bell,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/axios";
import type { Notification, Page } from "@/types/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatRelativeTime, cn } from "@/lib/utils";

const renderMessageWithAmount = (message: string, metadataString?: string) => {
  let amountToHighlight: string | null = null;
  if (metadataString) {
    try {
      const metadata = JSON.parse(metadataString);
      if (metadata && metadata.amount) {
        amountToHighlight = String(metadata.amount);
      }
    } catch (e) {
      // ignore
    }
  }

  if (amountToHighlight && message.includes(amountToHighlight)) {
    const parts = message.split(amountToHighlight);
    return (
      <>
        {parts.map((part, i) => (
          <span key={i}>
            {part}
            {i < parts.length - 1 && (
              <span className="font-bold text-primary">
                {amountToHighlight}
              </span>
            )}
          </span>
        ))}
      </>
    );
  }

  const regex = /((?:\d{1,3}(?:,\d{3})*|\d+)\.\d{2})/g;
  const parts = message.split(regex);
  return (
    <>
      {parts.map((part, i) => {
        if (/^(?:\d{1,3}(?:,\d{3})*|\d+)\.\d{2}$/.test(part)) {
          return (
            <span key={i} className="font-bold text-primary">
              {part}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
};

export function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const observer = useRef<IntersectionObserver | null>(null);
  const isFetchingRef = useRef(isFetchingMore);
  const hasMoreRef = useRef(hasMore);

  useEffect(() => {
    isFetchingRef.current = isFetchingMore;
  }, [isFetchingMore]);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  const lastNotificationElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      if (node) {
        observer.current = new IntersectionObserver(
          (entries) => {
            if (
              entries[0].isIntersecting &&
              hasMoreRef.current &&
              !isFetchingRef.current
            ) {
              setPage((prevPage) => prevPage + 1);
            }
          },
          { rootMargin: "100px" }
        );
        observer.current.observe(node);
      }
    },
    [loading]
  );

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (page === 0) setLoading(true);
        else setIsFetchingMore(true);

        const response = await api.get<Page<Notification>>(
          `/notification?page=${page}&size=10`
        );
        const content = response.data.content || [];
        setNotifications((prev) => {
          if (page === 0) return content;

          const newNotifications = content.filter(
            (newNotif) =>
              !prev.some((existingNotif) => existingNotif.id === newNotif.id)
          );
          return [...prev, ...newNotifications];
        });

        setHasMore(!response.data.last);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        if (page === 0) setLoading(false);
        setIsFetchingMore(false);
      }
    };

    fetchNotifications();
  }, [page]);

  const getIconForType = (type: string) => {
    switch (type) {
      case "USER_REGISTERED":
        return <UserPlus className="size-4 text-white" />;
      case "TRANSACTION_SENT":
        return <ArrowUpRight className="size-4 text-white" />;
      case "TRANSACTION_RECEIVED":
        return <ArrowDownLeft className="size-4 text-white" />;
      case "PAYMENT_FAILED":
        return <XCircle className="size-4 text-white" />;
      default:
        return <Bell className="size-4 text-white" />;
    }
  };

  const getIconColorForType = (type: string) => {
    switch (type) {
      case "USER_REGISTERED":
        return "border-cyan-100 dark:border-cyan-900 bg-cyan-500 text-cyan-500";
      case "TRANSACTION_SENT":
        return "border-blue-100 dark:border-blue-900 bg-blue-500 text-blue-500";
      case "TRANSACTION_RECEIVED":
        return "border-green-100 dark:border-green-900 bg-green-500 text-green-500";
      case "PAYMENT_FAILED":
        return "border-red-100 dark:border-red-900 bg-red-500 text-red-500";
      default:
        return "border-muted bg-muted/50 text-muted-foreground";
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center border-b bg-background p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="mr-2"
        >
          <ArrowLeft className="size-5" />
        </Button>
        <h1 className="text-lg font-semibold">Notifications</h1>
      </div>

      <div className="flex flex-1 flex-col space-y-6 p-6">
        <Card className="overflow-hidden rounded-3xl border-muted p-0 shadow-sm">
          <CardContent className="flex flex-col divide-y divide-border/40 p-0">
            {loading && page === 0 ? (
              <div className="animate-pulse p-8 text-center text-sm font-medium text-muted-foreground">
                Loading notifications...
              </div>
            ) : !notifications || notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center space-y-3 p-8 text-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-muted/50 text-muted-foreground">
                  <Bell className="size-6 opacity-50" />
                </div>
                <div className="text-sm font-medium text-muted-foreground">
                  No notifications yet
                </div>
              </div>
            ) : (
              <>
                {notifications.map((notification, index) => {
                  const colorClass = getIconColorForType(notification.type);
                  return (
                    <div
                      ref={
                        notifications.length === index + 1
                          ? lastNotificationElementRef
                          : undefined
                      }
                      key={notification.id}
                      className="flex h-[104px] items-center gap-4 p-4 transition-colors hover:bg-muted/30"
                    >
                      <div
                        className={cn(
                          "flex size-14 shrink-0 items-center justify-center rounded-full border-12",
                          colorClass
                        )}
                      >
                        {getIconForType(notification.type)}
                      </div>
                      <div className="flex flex-1 flex-col overflow-hidden">
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-sm font-bold tracking-tight">
                            {notification.title}
                          </span>
                          <span className="shrink-0 text-[10px] font-bold whitespace-nowrap text-muted-foreground">
                            {formatRelativeTime(notification.createdAt)}
                          </span>
                        </div>
                        <span className="mt-0.5 truncate text-sm text-muted-foreground">
                          {renderMessageWithAmount(
                            notification.shortMessage || notification.message,
                            notification.metadata
                          )}
                        </span>
                      </div>
                    </div>
                  );
                })}
                {isFetchingMore && (
                  <div className="flex items-center justify-center p-6">
                    <Loader2 className="size-6 animate-spin text-muted-foreground" />
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
