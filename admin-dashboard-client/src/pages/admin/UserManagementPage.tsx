import { useState } from "react";
import { Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type UserStatus = "ACTIVE" | "SUSPENDED";

interface User {
  id: string;
  name: string;
  phone: string;
  status: UserStatus;
  balance: number;
  avatar?: string;
}

const MOCK_USERS: User[] = [
  { id: "1", name: "Alexander Mitchell", phone: "+1 (555) 012-3456", status: "ACTIVE", balance: 45230.00 },
  { id: "2", name: "Sarah Chen", phone: "+1 (555) 789-0123", status: "ACTIVE", balance: 12840.50 },
  { id: "3", name: "James Wilson", phone: "+1 (555) 456-7890", status: "SUSPENDED", balance: 0.00 },
  { id: "4", name: "Robert King", phone: "+1 (555) 234-5678", status: "ACTIVE", balance: 8922.35 },
];

const TOTAL_USERS = 12482;
const TOTAL_PAGES = 156;

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export function UserManagementPage() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [currentPage, setCurrentPage] = useState(1);

  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE" }
          : u
      )
    );
  };

  return (
    // -m-8 cancels the parent padding so we can control our own scroll
    <div className="-m-8 h-[calc(100vh-3.5rem)] flex flex-col overflow-hidden">
      {/* Fixed top section — header + stats */}
      <div className="px-8 pt-8 pb-4 flex flex-col gap-6 shrink-0 max-w-6xl w-full mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
          <p className="text-muted-foreground mt-2">
            Orchestrate and monitor the global user ecosystem.
          </p>
        </div>
        <Button variant="outline" className="gap-2 mt-1">
          <Filter className="size-4" />
          Filter
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Users</p>
            <div className="flex items-baseline gap-3 mt-2">
              <p className="text-4xl font-bold">{TOTAL_USERS.toLocaleString()}</p>
              <Badge variant="secondary" className="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-0 font-semibold">
                +12%
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active Sessions</p>
            <div className="flex items-baseline gap-3 mt-2">
              <p className="text-4xl font-bold">3,105</p>
              <span className="text-sm text-muted-foreground">Live now</span>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>

      {/* Scrollable table section — fills remaining height */}
      <div className="flex-1 min-h-0 px-8 pb-8 overflow-hidden max-w-6xl w-full mx-auto">
        <Card className="shadow-sm h-full flex flex-col overflow-hidden">
          <CardContent className="p-0 flex flex-col flex-1 min-h-0">
            {/* Scrollable table body */}
            <div className="overflow-y-auto flex-1 min-h-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b hover:bg-transparent">
                <TableHead className="pl-6 text-xs font-semibold uppercase tracking-wider">Name &amp; Contact</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Account Status</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider">Balance ($)</TableHead>
                <TableHead className="pr-6 text-right text-xs font-semibold uppercase tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className="border-b last:border-0">
                  <TableCell className="pl-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar size="lg">
                        {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-sm">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.phone}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge
                      variant="secondary"
                      className={cn(
                        "border-0 font-medium",
                        user.status === "ACTIVE"
                          ? "bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400"
                          : "bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400"
                      )}
                    >
                      {user.status === "ACTIVE" ? "Active" : "Suspended"}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 font-medium">
                    {user.balance.toFixed(2)}
                  </TableCell>
                  <TableCell className="pr-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="sm">
                        View User
                      </Button>
                      <Button
                        size="sm"
                        variant={user.status === "ACTIVE" ? "default" : "outline"}
                        className={cn(
                          user.status === "ACTIVE"
                            ? "bg-primary text-primary-foreground"
                            : "text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                        )}
                        onClick={() => toggleUserStatus(user.id)}
                      >
                        {user.status === "ACTIVE" ? "Disable" : "Enable"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
            </div>

            {/* Pagination — stays pinned to the bottom of the card */}
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">1-4</span> of{" "}
              <span className="font-medium text-foreground">{TOTAL_USERS.toLocaleString()}</span> users
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
              <span className="px-1 text-muted-foreground text-sm">…</span>
              <Button
                variant="ghost"
                size="sm"
                className="size-8 p-0 text-sm"
                onClick={() => setCurrentPage(TOTAL_PAGES)}
              >
                {TOTAL_PAGES}
              </Button>
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
    </div>
  );
}
