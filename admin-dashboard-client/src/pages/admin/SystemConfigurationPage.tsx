import { useState, useEffect } from "react";
import { Save, ArrowRightLeft, Coins } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLayoutContext } from "@/app/providers/LayoutContext";

export function SystemConfigurationPage() {
  const { setSearchPlaceholder } = useLayoutContext();

  useEffect(() => {
    setSearchPlaceholder("Search parameters...");
    return () => setSearchPlaceholder("Search across architecture...");
  }, [setSearchPlaceholder]);

  // Transaction Limits
  const [minTransfer, setMinTransfer] = useState("5.00");
  const [maxTransfer, setMaxTransfer] = useState("10000.00");

  // Revenue Architecture
  const [fixedFee, setFixedFee] = useState("0.50");
  const [percentageFee, setPercentageFee] = useState("1.25");

  // Save/dirty state
  const [saved, setSaved] = useState(true);

  const handleChange = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
    setSaved(false);
  };

  const handleSave = () => setSaved(true);
  const handleDiscard = () => {
    setMinTransfer("5.00");
    setMaxTransfer("10000.00");
    setFixedFee("0.50");
    setPercentageFee("1.25");
    setSaved(true);
  };

  // Live simulation: fee on EGP 100
  const fixed = parseFloat(fixedFee) || 0;
  const pct = parseFloat(percentageFee) || 0;
  const simulatedTotal = (fixed + (pct / 100) * 100).toFixed(2);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">System Configuration</h2>
        <p className="text-muted-foreground mt-2 max-w-lg">
          Manage global financial protocols and architecture limits parameters for the QuickPay system.
        </p>
      </div>

      {/* Transaction Limits */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ArrowRightLeft className="size-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Transaction Limits</CardTitle>
              <CardDescription>Define liquidity movement boundaries</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Min Transfer Amount (EGP)
              </label>
              <div className="flex items-center gap-2 rounded-md border border-input bg-muted/30 px-4 py-3">
                <span className="text-sm font-semibold text-muted-foreground">EGP</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={minTransfer}
                  onChange={handleChange(setMinTransfer)}
                  className="flex-1 bg-transparent text-sm font-semibold focus:outline-none"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Max Transfer Amount (EGP)
              </label>
              <div className="flex items-center gap-2 rounded-md border border-input bg-muted/30 px-4 py-3">
                <span className="text-sm font-semibold text-muted-foreground">EGP</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={maxTransfer}
                  onChange={handleChange(setMaxTransfer)}
                  className="flex-1 bg-transparent text-sm font-semibold focus:outline-none"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Architecture */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
              <Coins className="size-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Revenue Architecture</CardTitle>
              <CardDescription>Configure fee distribution for P2P transfers</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            {/* Fixed Fee */}
            <div className="flex flex-1 flex-col gap-2">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Fixed Fee (EGP)
              </label>
              <div className="rounded-md border border-input bg-background px-4 py-3">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={fixedFee}
                  onChange={handleChange(setFixedFee)}
                  className="w-full bg-transparent text-sm font-semibold focus:outline-none"
                />
              </div>
            </div>

            <span className="mt-6 text-xl font-light text-muted-foreground">+</span>

            {/* Percentage Fee */}
            <div className="flex flex-1 flex-col gap-2">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Percentage Fee (%)
              </label>
              <div className="rounded-md border border-input bg-background px-4 py-3">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={percentageFee}
                  onChange={handleChange(setPercentageFee)}
                  className="w-full bg-transparent text-sm font-semibold focus:outline-none"
                />
              </div>
            </div>

            {/* Live Simulation */}
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Simulation
              </label>
              <div className="rounded-md border border-primary/20 bg-primary/5 px-4 py-3 min-h-[46px] flex items-center">
                <p className="text-sm text-muted-foreground leading-snug">
                  On EGP 100 transfer, user pays{" "}
                  <span className="font-bold text-primary">${simulatedTotal}</span> in total fees.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button variant="outline" onClick={handleDiscard} disabled={saved}>
          Discard Changes
        </Button>
        <Button onClick={handleSave} disabled={saved} className="gap-2">
          <Save className="size-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
