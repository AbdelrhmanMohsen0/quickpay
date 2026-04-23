import { Link, useLocation } from "react-router-dom";
import { User, Bell, Home, ArrowRightLeft, History, UserCircle, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/app/hooks/useAuth";
import { useTheme } from "@/app/providers/theme-provider";

type MainLayoutProps = {
  children: React.ReactNode;
};

export function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  // Mock notification count
  const unreadNotifications = 3;

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Transfer", path: "/transfer", icon: ArrowRightLeft },
    { name: "History", path: "/history", icon: History },
    { name: "Account", path: "/profile", icon: UserCircle },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background md:mx-auto md:max-w-md md:border-x md:shadow-sm">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between bg-background/80 px-4 py-3 backdrop-blur-md">
        <Link to="/profile" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Welcome back,</span>
            <span className="text-sm font-semibold leading-none">{`${user?.firstName} ${user?.lastName}`}</span>
          </div>
        </Link>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
          >
            {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </button>
          <Link
            to="/notifications"
            className="relative rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Bell className="size-5" />
            {unreadNotifications > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
                {unreadNotifications > 99 ? "99+" : unreadNotifications}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      {/* Added pb-20 to ensure content doesn't get hidden behind the fixed bottom navigation */}
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 z-50 w-full border-t pb-2 sm:pb-4 md:max-w-md">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== "/" && location.pathname.startsWith(item.path));
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 rounded-lg px-3 py-2 transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "size-5",
                    isActive && "fill-primary/20 text-primary"
                  )}
                />
                <span className={cn("text-[10px] font-medium", isActive && "text-primary")}>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
