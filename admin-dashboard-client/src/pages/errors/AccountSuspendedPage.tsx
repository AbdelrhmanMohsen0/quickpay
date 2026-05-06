import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function AccountSuspendedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 text-center">
      <h1 className="text-8xl md:text-9xl font-extrabold tracking-widest text-destructive/20">403</h1>
      <div className="bg-destructive px-3 py-1 text-destructive-foreground text-sm font-semibold rounded shadow-lg">
        Account Suspended
      </div>
      <p className="mt-8 text-xl text-muted-foreground max-w-md">
        Your account has been suspended. Please contact support for more information.
      </p>
      <Button asChild className="mt-8" size="lg" variant="default">
        <Link to="/auth">Return to Login</Link>
      </Button>
    </div>
  );
}
