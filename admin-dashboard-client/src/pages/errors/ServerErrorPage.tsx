import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function ServerErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 text-center">
      <h1 className="text-8xl md:text-9xl font-extrabold tracking-widest text-destructive/20">500</h1>
      <div className="bg-destructive px-3 py-1 text-destructive-foreground text-sm font-semibold rounded absolute shadow-lg">
        Server Error
      </div>
      <p className="mt-8 text-xl text-muted-foreground max-w-md">
        Oops! Something went wrong on our end. Please try again later.
      </p>
      <Button asChild className="mt-8" size="lg">
        <Link to="/">Return to Home</Link>
      </Button>
    </div>
  );
}
