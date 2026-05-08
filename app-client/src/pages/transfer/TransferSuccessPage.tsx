import { useState, useEffect } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { CheckCircle2, User as UserIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface TransferSuccessState {
  amount: number;
  recipientPhone: string;
  transactionId: string;
  date: string;
}

export function TransferSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [successData] = useState<TransferSuccessState | null>(
    () => location.state as TransferSuccessState
  );

  useEffect(() => {
    // Clear location state so that back navigation won't show this page again
    if (location.state) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate]);

  if (!successData) {
    // If accessed directly without state, redirect to home
    return <Navigate to="/" replace />;
  }

  const formattedDate = new Date(successData.date).toLocaleString("en-EG", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center p-4 pt-12 pb-24 text-center">
      <div className="mb-6 flex justify-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-primary/10 text-primary animate-in zoom-in duration-500">
          <CheckCircle2 className="size-10" />
        </div>
      </div>

      <h1 className="mb-2 text-2xl font-bold tracking-tight">
        Your transfer request has been submitted.
      </h1>
      <p className="mb-8 text-muted-foreground">
        We’ll notify you once it’s processed.
      </p>

      <Card className="w-full border-none shadow-none bg-muted/30 mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center mb-6">
            <span className="text-sm text-muted-foreground mb-1">Transfer Amount</span>
            <span className="text-4xl font-bold tracking-tighter">
              {successData.amount.toFixed(2)} EGP
            </span>
          </div>
          
          <Separator className="mb-6" />

          <div className="space-y-4 text-left text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Recipient</span>
              <div className="flex items-center gap-2">
                <UserIcon className="size-4 text-muted-foreground" />
                <span className="font-medium">{successData.recipientPhone}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Date & time</span>
              <span className="font-medium">{formattedDate}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Transaction ID</span>
              <span className="font-mono text-xs font-medium text-muted-foreground">
                {successData.transactionId}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button
        className="w-full"
        size="lg"
        onClick={() => navigate("/", { replace: true })}
      >
        Back to Home
      </Button>
    </div>
  );
}
