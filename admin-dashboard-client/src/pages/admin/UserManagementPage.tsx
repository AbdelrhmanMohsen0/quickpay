import { useState } from "react";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

import { useUsersCount } from "@/app/hooks/useUsersCount";
import { useUsersList } from "@/app/hooks/useUsersList";
import type { UserListItem } from "@/services/userService";
import { updateUserStatus } from "@/services/userService";
import { useDebounce } from "@/app/hooks/useDebounce";
import { UserDetailSheet } from "@/components/UserDetailSheet";

function getInitials(firstName: string, lastName: string) {
  return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
}

export function UserManagementPage() {
  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const debouncedSearch = useDebounce(search, 400);

  const { usersCount } = useUsersCount();
  const { users, loading, error, refetch } = useUsersList(debouncedSearch);

  const toggleUserStatus = async (user: UserListItem) => {
    const nextStatus = user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    try {
      await updateUserStatus(user.id, nextStatus);
      refetch();
    } catch {
      // could add a toast here
    }
  };

  return (
    <>
    <div className="-m-8 h-[calc(100vh-3.5rem)] flex flex-col overflow-hidden">
      {/* Fixed top section */}
      <div className="px-8 pt-8 pb-4 flex flex-col gap-6 shrink-0 max-w-6xl w-full mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
            <p className="text-muted-foreground mt-2">
              Orchestrate and monitor the global user ecosystem.
            </p>
          </div>
        </div>

        {/* Stats + Search Row */}
        <div className="flex items-stretch gap-4">
          <Card className="shadow-sm shrink-0">
            <CardContent className="p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Users</p>
              <div className="flex items-baseline gap-3 mt-2">
                <p className="text-4xl font-bold">{usersCount ?? "—"}</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex-1 flex items-end pb-1">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="user-search"
                placeholder="Search by name or phone…"
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable table */}
      <div className="flex-1 min-h-0 px-8 pb-8 overflow-hidden max-w-6xl w-full mx-auto">
        <Card className="shadow-sm h-full flex flex-col overflow-hidden">
          <CardContent className="p-0 flex flex-col flex-1 min-h-0">
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
                  {loading && (
                    <TableRow>
                      <TableCell colSpan={4} className="py-12 text-center text-muted-foreground">
                        Loading users…
                      </TableCell>
                    </TableRow>
                  )}
                  {error && !loading && (
                    <TableRow>
                      <TableCell colSpan={4} className="py-12 text-center text-destructive">
                        {error}
                      </TableCell>
                    </TableRow>
                  )}
                  {!loading && !error && users.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="py-12 text-center text-muted-foreground">
                        No users found.
                      </TableCell>
                    </TableRow>
                  )}
                  {!loading && !error && users.map((user) => (
                    <TableRow key={user.id} className="border-b last:border-0">
                      <TableCell className="pl-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar size="lg">
                            <AvatarImage src={undefined} alt={`${user.firstName} ${user.lastName}`} />
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                              {getInitials(user.firstName, user.lastName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-sm">{user.firstName} {user.lastName}</p>
                            <p className="text-xs text-muted-foreground">{user.phoneNumber}</p>
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
                        {user.balance != null ? user.balance.toFixed(2) : "—"}
                      </TableCell>
                      <TableCell className="pr-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedUserId(user.id)}
                          >
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
                            onClick={() => toggleUserStatus(user)}
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

            {/* Footer */}
            {!loading && !error && (
              <div className="px-6 py-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Showing{" "}
                  <span className="font-medium text-foreground">{users.length}</span>
                  {debouncedSearch && (
                    <> result{users.length !== 1 ? "s" : ""} for &ldquo;<span className="font-medium text-foreground">{debouncedSearch}</span>&rdquo;</>
                  )}
                  {" "}of{" "}
                  <span className="font-medium text-foreground">{(usersCount ?? 0).toLocaleString()}</span>{" "}
                  total users
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>

    <UserDetailSheet
      userId={selectedUserId}
      onClose={() => setSelectedUserId(null)}
    /> </>
  );
}
