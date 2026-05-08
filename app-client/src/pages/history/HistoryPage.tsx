import { useEffect, useState, useRef, useCallback } from "react";
import { UserCircle, Loader2 } from "lucide-react";
import api from "@/lib/axios";
import type { Transaction, Page } from "@/types/api";
import { Card, CardContent } from "@/components/ui/card";

export function HistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
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

  const lastTransactionElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      
      if (node) {
        observer.current = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting && hasMoreRef.current && !isFetchingRef.current) {
            setPage((prevPage) => prevPage + 1);
          }
        }, { rootMargin: "100px" });
        observer.current.observe(node);
      }
    },
    [loading]
  );

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        if (page === 0) setLoading(true);
        else setIsFetchingMore(true);

        const response = await api.get<Page<Transaction>>(
          `/transaction?page=${page}&size=10`
        );
        const content = response.data.content || [];
        setTransactions((prev) => {
          if (page === 0) return content;
          
          const newTransactions = content.filter(
            (newTx) => !prev.some((existingTx) => existingTx.id === newTx.id)
          );
          return [...prev, ...newTransactions];
        });
        
        setHasMore(!response.data.last);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        if (page === 0) setLoading(false);
        setIsFetchingMore(false);
      }
    };

    fetchTransactions();
  }, [page]);

  return (
    <div className="flex flex-col space-y-6 p-6">
      <h1 className="text-xl font-medium tracking-tight">Transaction History</h1>

      <Card className="overflow-hidden rounded-3xl border-muted shadow-sm p-0">
        <CardContent className="flex flex-col divide-y divide-border/40 p-0">
          {loading && page === 0 ? (
            <div className="animate-pulse p-8 text-center text-sm font-medium text-muted-foreground">
              Loading transactions...
            </div>
          ) : !transactions || transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center space-y-3 p-8 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted/50 text-muted-foreground">
                <UserCircle className="size-6 opacity-50" />
              </div>
              <div className="text-sm font-medium text-muted-foreground">
                No transactions found
              </div>
            </div>
          ) : (
            <>
              {transactions.map((tx, index) => (
                <div
                  ref={transactions.length === index + 1 ? lastTransactionElementRef : undefined}
                  key={tx.id}
                  className="flex items-center justify-between p-4 transition-colors hover:bg-muted/30"
                >
                <div className="flex items-center gap-3.5">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground/80">
                    <UserCircle className="size-6" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold tracking-tight">
                      {tx.userInfo?.firstName
                        ? `${tx.userInfo.firstName} ${tx.userInfo.lastName}`
                        : "Unknown User"}
                    </span>
                    <span className="mt-0.5 text-xs font-medium text-muted-foreground">
                      {new Date(
                        tx.timestamp.endsWith("Z")
                          ? tx.timestamp
                          : `${tx.timestamp}Z`
                      ).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
                <div
                  className={`text-sm font-bold tracking-tight ${tx.type === "RECEIVED" ? "text-green-600 dark:text-green-500" : "text-foreground"}`}
                >
                  {tx.type === "RECEIVED" ? "+" : "-"}
                  {tx.amount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  EGP
                </div>
              </div>
              ))}
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
  );
}
