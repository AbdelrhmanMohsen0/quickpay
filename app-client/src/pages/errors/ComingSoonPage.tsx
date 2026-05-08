import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function ComingSoonPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 text-center">
      <h1 className="text-6xl md:text-8xl font-extrabold tracking-widest text-primary/20">SOON</h1>
      <div className="bg-primary px-3 py-1 text-primary-foreground text-sm font-semibold rounded shadow-lg">
        Coming Soon
      </div>
      <p className="mt-8 text-xl text-muted-foreground max-w-md">
        No Payment Gateway or Bank Account Integration is done yet because we are poor! :(
      </p>
      <Button asChild className="mt-8" size="lg">
        <Link to="/">Return to Home</Link>
      </Button>
    </div>
  );
}
