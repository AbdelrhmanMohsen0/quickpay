import { useEffect, useState } from "react";
import { Phone, Hash, ShieldCheck } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { getUserById, type UserListItem } from "@/services/userService";

interface Props {
  userId: string | null;
  onClose: () => void;
}

function getInitials(firstName: string, lastName: string) {
  return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span className="text-sm font-medium break-all">{value}</span>
      </div>
    </div>
  );
}

export function UserDetailSheet({ userId, onClose }: Props) {
  const [user, setUser] = useState<UserListItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setUser(null);
      return;
    }

    setLoading(true);
    setError(null);

    getUserById(userId)
      .then(setUser)
      .catch((err: any) =>
        setError(err.response?.data?.message ?? "Failed to load user.")
      )
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <Sheet open={!!userId} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md flex flex-col gap-0 p-0 overflow-y-auto">
        <SheetHeader className="sr-only">
          <SheetTitle>User Details</SheetTitle>
          <SheetDescription>Full information for the selected user.</SheetDescription>
        </SheetHeader>

        {loading && (
          <div className="flex flex-1 items-center justify-center py-24 text-muted-foreground text-sm">
            Loading…
          </div>
        )}

        {error && !loading && (
          <div className="flex flex-1 items-center justify-center py-24 text-destructive text-sm">
            {error}
          </div>
        )}

        {user && !loading && (
          <>
            {/* Hero */}
            <div className="flex flex-col items-center gap-4 px-8 pt-10 pb-6 bg-muted/30">
              <Avatar className="size-20">
                <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                  {getInitials(user.firstName, user.lastName)}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h2 className="text-xl font-bold">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">{user.phoneNumber}</p>
              </div>
              <Badge
                variant="secondary"
                className={cn(
                  "border-0 font-medium px-3 py-1",
                  user.status === "ACTIVE"
                    ? "bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400"
                    : "bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400"
                )}
              >
                {user.status === "ACTIVE" ? "Active" : "Suspended"}
              </Badge>
            </div>

            <Separator />

            {/* Details */}
            <div className="flex flex-col px-6 py-2">
              <DetailRow
                icon={Hash}
                label="User ID"
                value={<span className="font-mono text-xs">{user.id}</span>}
              />
              <Separator />
              <DetailRow icon={Phone} label="Phone Number" value={user.phoneNumber} />
              <Separator />
              <DetailRow
                icon={ShieldCheck}
                label="Account Status"
                value={
                  <Badge
                    variant="secondary"
                    className={cn(
                      "border-0 font-medium mt-0.5",
                      user.status === "ACTIVE"
                        ? "bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400"
                        : "bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400"
                    )}
                  >
                    {user.status === "ACTIVE" ? "Active" : "Suspended"}
                  </Badge>
                }
              />
              {user.balance != null && (
                <>
                  <Separator />
                  <DetailRow
                    icon={ShieldCheck}
                    label="Balance"
                    value={`$${user.balance.toFixed(2)}`}
                  />
                </>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
