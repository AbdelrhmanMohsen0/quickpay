import { Link, useLocation } from "react-router-dom";
import { LogOut, Users, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/app/hooks/useAuth";
import { LayoutProvider, useLayoutContext } from "@/app/providers/LayoutContext";



function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { logout, user } = useAuth();
  const { searchPlaceholder } = useLayoutContext();

  const navItems = [
    { name: "User Management", path: "/admin/users", icon: Users },
    { name: "System Configuration", path: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-background flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary">QuickPay</h1>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1 font-semibold">The Financial Architect</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const isActive = item.exact 
              ? location.pathname === item.path || location.pathname === item.path + "/"
              : location.pathname.startsWith(item.path);
              
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium border-l-4",
                  isActive 
                    ? "bg-primary/10 text-primary border-primary rounded-l-none" 
                    : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="size-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>
        
        <div className="p-4 mt-auto border-t">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors w-full cursor-pointer"
          >
            <LogOut className="size-5" />
            Logout
          </button>
          <p className="text-[10px] text-muted-foreground px-3 mt-4">© 2024 QUICKPAY V2.4.0</p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-14 items-center justify-between border-b bg-background px-8">
          
          <div className="flex items-center gap-3 ml-auto">
            <div className="text-right">
              <p className="text-sm font-semibold leading-none">Admin User</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {user ? `${user.firstName} ${user.lastName}` : ""}
              </p>
            </div>
            <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
              <User className="size-5" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-hidden">
          <div className="h-full p-8 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </LayoutProvider>
  );
}
