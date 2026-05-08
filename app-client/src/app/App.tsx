import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Send, PlusCircle, UserCircle } from "lucide-react";
import api from "@/lib/axios";
import type { Transaction, WalletBalance, Page } from "@/types/api";
import { Card, CardContent } from "@/components/ui/card";

export default function App() {
  const [balance, setBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [balanceRes, transactionsRes] = await Promise.all([
          api.get<WalletBalance>("/wallet/balance"),
          api.get<Page<Transaction>>("/transaction?page=0&size=5"),
        ]);
        setBalance(balanceRes.data.balance);

        setTransactions(transactionsRes.data.content);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col space-y-6 p-4">
      {/* Total Balance Widget */}
      <Card className="relative overflow-hidden rounded-3xl bg-primary text-primary-foreground shadow-lg ring-1 ring-primary/20">
        {/* Subtle Pattern Overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-size-[16px_16px]" />
        <CardContent className="relative z-10 p-8">
          <div className="flex flex-col items-center justify-center space-y-3">
            <span className="text-sm font-medium tracking-wider text-primary-foreground/80 uppercase">
              Total Balance
            </span>
            <span className="text-4xl font-extrabold tracking-tight">
              {balance !== null
                ? `${balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} EGP`
                : "--- EGP"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Link to="/transfer" className="group block focus:outline-none">
          <Card className="h-full rounded-3xl border-transparent bg-muted/40 shadow-sm transition-all duration-200 hover:border-border/50 hover:bg-muted/60 hover:shadow-md">
            <CardContent className="flex flex-col items-start gap-3 px-4 py-1">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <Send className="size-5" />
              </div>
              <div className="flex w-full flex-col overflow-hidden">
                <span className="text-sm leading-none font-bold">
                  Send Money
                </span>
                <span className="mt-1.5 truncate text-xs text-muted-foreground">
                  Transfer to others
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/coming-soon" className="group block focus:outline-none">
          <Card className="h-full rounded-3xl border-transparent bg-muted/40 shadow-sm transition-all duration-200 hover:border-border/50 hover:bg-muted/60 hover:shadow-md">
            <CardContent className="flex flex-col items-start gap-3 px-4 py-1">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <PlusCircle className="size-5" />
              </div>
              <div className="flex w-full flex-col overflow-hidden">
                <span className="text-sm leading-none font-bold">
                  Add Funds
                </span>
                <span className="mt-1.5 truncate text-xs text-muted-foreground">
                  Top up wallet
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Transactions */}
      <div className="flex flex-col space-y-4 pt-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-lg font-bold tracking-tight">
            Recent transactions
          </h2>
          <Link
            to="/history"
            className="text-sm font-semibold text-primary transition-colors hover:text-primary/80"
          >
            View all
          </Link>
        </div>

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
                  No recent transactions
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
    </div>
  );
}
