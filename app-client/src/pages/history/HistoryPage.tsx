import { useEffect, useState } from "react";
import { UserCircle } from "lucide-react";
import api from "@/lib/axios";
import type { Transaction, Page } from "@/types/api";
import { Card, CardContent } from "@/components/ui/card";

export function HistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get<Page<Transaction>>("/transaction");
        // // Sort descending by timestamp in case the API doesn't
        // const sorted = response.data.content.sort(
        //   (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        // );
        setTransactions(response.data.content);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="flex flex-col space-y-6 p-6">
      <h1 className="text-xl font-medium tracking-tight">Transaction History</h1>

      <Card className="overflow-hidden rounded-3xl border-muted shadow-sm p-0">
        <CardContent className="flex flex-col divide-y divide-border/40 p-0">
          {loading ? (
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
            transactions.map((tx) => (
              <div
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
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
