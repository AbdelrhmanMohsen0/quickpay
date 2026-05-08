import { useAuth } from "@/app/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { User, Lock, LogOut, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export function ProfilePage() {
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col min-h-[calc(100vh-9rem)] bg-muted/30">
      {/* Top Profile Section */}
      <div className="flex flex-col items-center justify-center p-8 bg-background border-b">
        <div className="flex size-24 items-center justify-center rounded-full bg-primary/10 text-primary mb-4 ring-4 ring-primary/5">
          <User className="size-12" />
        </div>
        <h2 className="text-2xl font-bold">
          {user?.firstName} {user?.lastName}
        </h2>
        <p className="text-muted-foreground mt-1">{user?.phoneNumber}</p>
      </div>

      <div className="flex-1 p-4 space-y-6">
        {/* General Settings Section */}
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-1">
            General Settings
          </h3>
          <div className="bg-background rounded-xl border shadow-sm overflow-hidden">
            <Link
              to="/profile/edit"
              className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="flex size-10 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
                  <User className="size-5" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Edit profile</h4>
                  <p className="text-sm text-muted-foreground">
                    Update your personal details
                  </p>
                </div>
              </div>
              <ChevronRight className="size-5 text-muted-foreground" />
            </Link>
          </div>
        </section>

        {/* Privacy & Security Section */}
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-1">
            Privacy & Security
          </h3>
          <div className="bg-background rounded-xl border shadow-sm overflow-hidden">
            <Link
              to="/profile/password"
              className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="flex size-10 items-center justify-center rounded-full bg-purple-500/10 text-purple-500">
                  <Lock className="size-5" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Change Password</h4>
                  <p className="text-sm text-muted-foreground">
                    Update your security credentials
                  </p>
                </div>
              </div>
              <ChevronRight className="size-5 text-muted-foreground" />
            </Link>
          </div>
        </section>
      </div>

      {/* Bottom Section */}
      <div className="p-4 mt-auto mb-4 space-y-4">
        <Button
          variant="destructive"
          className="w-full gap-2 h-12 text-base font-semibold cursor-pointer"
          onClick={() => logout()}
        >
          <LogOut className="size-5" />
          Logout
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          QuickPay App Version 1.0.0
        </p>
      </div>
    </div>
  );
}
