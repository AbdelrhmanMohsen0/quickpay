import { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TxStatus = "SUCCESS" | "FAILED" | "PENDING";

interface Transaction {
  id: string;
  sender: { name: string; initials: string };
  receiver: { name: string; initials: string };
  amount: number;
  datetime: string;
  status: TxStatus;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "#TRX-99210-B4",
    sender: { name: "Adrian Miller", initials: "AM" },
    receiver: { name: "Tesla Store Inc.", initials: "TS" },
    amount: 1240.0,
    datetime: "Oct 19, 2024 • 14:22",
    status: "SUCCESS",
  },
  {
    id: "#TRX-88211-C1",
    sender: { name: "Sarah Waters", initials: "SW" },
    receiver: { name: "Amazon Cloud", initials: "AM" },
    amount: 45.99,
    datetime: "Oct 19, 2024 • 13:05",
    status: "FAILED",
  },
  {
    id: "#TRX-77102-A9",
    sender: { name: "Robert King", initials: "RK" },
    receiver: { name: "Goldman Sachs", initials: "GS" },
    amount: 12500.0,
    datetime: "Oct 19, 2024 • 11:45",
    status: "PENDING",
  },
  {
    id: "#TRX-44122-Z0",
    sender: { name: "Linda Chen", initials: "LC" },
    receiver: { name: "Apple Store", initials: "AP" },
    amount: 2199.0,
    datetime: "Oct 19, 2024 • 09:12",
    status: "SUCCESS",
  },
];

const TOTAL_TRANSACTIONS = 2451;
const TOTAL_PAGES = 3;

const statusConfig: Record<
  TxStatus,
  { label: string; className: string; dotColor: string }
> = {
  SUCCESS: {
    label: "Success",
    className:
      "bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400 border-0",
    dotColor: "bg-sky-500",
  },
  FAILED: {
    label: "Failed",
    className:
      "bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border-0",
    dotColor: "bg-rose-500",
  },
  PENDING: {
    label: "Pending",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-0",
    dotColor: "bg-amber-500",
  },
};

export function TransactionsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [amountRange, setAmountRange] = useState(100);

  const clearFilters = () => {
    setStatusFilter("ALL");
    setAmountRange(100);
  };

  // Map slider 0-100 → $0–$10k (100 = no upper limit)
  const maxAmount = amountRange === 100 ? Infinity : (amountRange / 100) * 10000;

  const filteredTransactions = MOCK_TRANSACTIONS.filter((tx) => {
    const statusMatch = statusFilter === "ALL" || tx.status === statusFilter;
    const amountMatch = tx.amount <= maxAmount;
    return statusMatch && amountMatch;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Transactions Monitoring
        </h2>
        <p className="text-muted-foreground mt-2">
          Real-time surveillance of global financial flows.
        </p>
      </div>

      {/* Filters */}
      <Card className="shadow-sm">
        <CardContent className="p-5">
          <div className="flex flex-wrap items-center gap-6">
            {/* Date Range */}
            <div className="flex flex-col gap-1">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Date Range
              </p>
              <div className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="size-4 text-muted-foreground" />
                <span>Oct 12 - Oct 19, 2024</span>
              </div>
            </div>

            <div className="h-8 w-px bg-border" />

            {/* Status Filter */}
            <div className="flex flex-col gap-1">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Status
              </p>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-8 rounded-md border border-input bg-background px-2 pr-7 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="SUCCESS">Success</option>
                <option value="FAILED">Failed</option>
                <option value="PENDING">Pending</option>
              </select>
            </div>

            <div className="h-8 w-px bg-border" />

            {/* Amount Range Slider */}
            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Amount Range
              </p>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground">$0</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={amountRange}
                  onChange={(e) => setAmountRange(Number(e.target.value))}
                  className="w-36 accent-primary cursor-pointer"
                />
                <span className="text-sm font-medium text-muted-foreground">$10k+</span>
              </div>
            </div>

            <div className="ml-auto">
              <Button variant="link" className="text-primary px-0 font-semibold" onClick={clearFilters}>
                Clear All Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b hover:bg-transparent">
                <TableHead className="pl-6 text-xs font-semibold uppercase tracking-wider w-36">
                  Transaction ID
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Sender</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Receiver</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Amount</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Date/Time</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Status</TableHead>
                <TableHead className="pr-6 text-right text-xs font-semibold uppercase tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((tx) => {
                const status = statusConfig[tx.status];
                return (
                  <TableRow key={tx.id} className="border-b last:border-0">
                    {/* Transaction ID */}
                    <TableCell className="pl-6 py-5">
                      <span className="font-semibold text-primary text-sm">
                        {tx.id}
                      </span>
                    </TableCell>

                    {/* Sender */}
                    <TableCell className="py-5">
                      <div className="flex items-center gap-2">
                        <Avatar size="sm">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                            {tx.sender.initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{tx.sender.name}</span>
                      </div>
                    </TableCell>

                    {/* Receiver */}
                    <TableCell className="py-5">
                      <div className="flex items-center gap-2">
                        <Avatar size="sm">
                          <AvatarFallback className="bg-muted text-muted-foreground text-xs font-semibold">
                            {tx.receiver.initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{tx.receiver.name}</span>
                      </div>
                    </TableCell>

                    {/* Amount */}
                    <TableCell className="py-5 font-semibold text-sm">
                      ${tx.amount.toFixed(2)}
                    </TableCell>

                    {/* Date/Time */}
                    <TableCell className="py-5 text-sm text-muted-foreground">
                      {tx.datetime}
                    </TableCell>

                    {/* Status */}
                    <TableCell className="py-5">
                      <Badge variant="secondary" className={cn("gap-1.5 font-medium", status.className)}>
                        <span className={cn("size-1.5 rounded-full", status.dotColor)} />
                        {status.label}
                      </Badge>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="pr-6 py-5 text-right">
                      <button className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors">
                        View Details
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground">1-{filteredTransactions.length}</span> of{" "}
              <span className="font-medium text-foreground">
                {filteredTransactions.length.toLocaleString()}
              </span>{" "}
              transactions
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="size-8 p-0"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="size-4" />
              </Button>
              {[1, 2, 3].map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "ghost"}
                  size="sm"
                  className="size-8 p-0 text-sm"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="ghost"
                size="sm"
                className="size-8 p-0"
                disabled={currentPage === TOTAL_PAGES}
                onClick={() => setCurrentPage((p) => Math.min(TOTAL_PAGES, p + 1))}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
