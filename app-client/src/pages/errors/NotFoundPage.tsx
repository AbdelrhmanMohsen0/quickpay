import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 text-center">
      <h1 className="text-8xl md:text-9xl font-extrabold tracking-widest text-primary/20">404</h1>
      <div className="bg-primary px-3 py-1 text-primary-foreground text-sm font-semibold rounded rotate-12 absolute shadow-lg">
        Page Not Found
      </div>
      <p className="mt-8 text-xl text-muted-foreground max-w-md">
        Oops! The page you are looking for doesn't exist or has been moved.
      </p>
      <Button asChild className="mt-8" size="lg">
        <Link to="/">Return to Home</Link>
      </Button>
    </div>
  );
}
