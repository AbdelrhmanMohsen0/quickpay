import { useState, useEffect, useRef } from "react";
import { Save, ArrowRightLeft, Coins, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLayoutContext } from "@/app/providers/LayoutContext";
import { getSystemConfig, updateSystemConfig } from "@/services/configService";
import type { SystemConfig } from "@/types/types";

type Status = "idle" | "loading" | "saving" | "success" | "error";

export function SystemConfigurationPage() {
  const { setSearchPlaceholder } = useLayoutContext();

  useEffect(() => {
    setSearchPlaceholder("Search parameters...");
    return () => setSearchPlaceholder("Search across architecture...");
  }, [setSearchPlaceholder]);

  // Server snapshot — used by "Discard" to reset
  const serverSnapshot = useRef<SystemConfig | null>(null);

  // Form fields
  const [minTransfer, setMinTransfer] = useState("");
  const [maxTransfer, setMaxTransfer] = useState("");
  const [fixedFee, setFixedFee] = useState("");
  const [percentageFee, setPercentageFee] = useState("");

  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState<Status>("loading");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // ── Fetch on mount ──────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    setStatus("loading");

    getSystemConfig()
      .then((config) => {
        if (cancelled) return;
        serverSnapshot.current = config;
        applyConfig(config);
        setStatus("idle");
      })
      .catch(() => {
        if (cancelled) return;
        setErrorMsg("Failed to load configuration from server.");
        setStatus("error");
      });

    return () => { cancelled = true; };
  }, []);

  function applyConfig(config: SystemConfig) {
    setMinTransfer(String(config.minTransferAmount));
    setMaxTransfer(String(config.maxTransferAmount));
    setFixedFee(String(config.fixedFee));
    setPercentageFee(String(config.percentageFee));
    setDirty(false);
  }

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleChange = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
    setDirty(true);
    if (status === "success" || status === "error") setStatus("idle");
  };

  const handleDiscard = () => {
    if (serverSnapshot.current) applyConfig(serverSnapshot.current);
  };

  const handleSave = async () => {
    setStatus("saving");
    setErrorMsg(null);
    const payload: SystemConfig = {
      minTransferAmount: parseFloat(minTransfer) || 0,
      maxTransferAmount: parseFloat(maxTransfer) || 0,
      fixedFee: parseFloat(fixedFee) || 0,
      percentageFee: parseFloat(percentageFee) || 0,
    };

    try {
      const updated = await updateSystemConfig(payload);
      serverSnapshot.current = updated;
      applyConfig(updated);
      setStatus("success");
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message ?? "Failed to save configuration.");
      setStatus("error");
    }
  };

  // ── Live simulation ─────────────────────────────────────────────────────────
  const fixed = parseFloat(fixedFee) || 0;
  const pct = parseFloat(percentageFee) || 0;
  const simulatedTotal = (fixed + (pct / 100) * 100).toFixed(2);

  const isLoading = status === "loading";
  const isSaving = status === "saving";

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">System Configuration</h2>
        <p className="text-muted-foreground mt-2 max-w-lg">
          Manage global financial protocols and architecture limits parameters for the QuickPay system.
        </p>
      </div>

      {/* Fetch error banner */}
      {status === "error" && !isSaving && (
        <div className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          {errorMsg}
        </div>
      )}

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
                  disabled={isLoading || isSaving}
                  className="flex-1 bg-transparent text-sm font-semibold focus:outline-none disabled:opacity-50"
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
                  disabled={isLoading || isSaving}
                  className="flex-1 bg-transparent text-sm font-semibold focus:outline-none disabled:opacity-50"
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
                  disabled={isLoading || isSaving}
                  className="w-full bg-transparent text-sm font-semibold focus:outline-none disabled:opacity-50"
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
                  disabled={isLoading || isSaving}
                  className="w-full bg-transparent text-sm font-semibold focus:outline-none disabled:opacity-50"
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
                  <span className="font-bold text-primary">EGP {simulatedTotal}</span> in total fees.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {/* Inline feedback */}
        {status === "success" && (
          <span className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-4" /> Saved successfully
          </span>
        )}
        {status === "error" && isSaving === false && errorMsg && (
          <span className="flex items-center gap-1.5 text-sm text-destructive">
            <AlertCircle className="size-4" /> {errorMsg}
          </span>
        )}

        <Button variant="outline" onClick={handleDiscard} disabled={!dirty || isSaving || isLoading}>
          Discard Changes
        </Button>
        <Button onClick={handleSave} disabled={!dirty || isSaving || isLoading} className="gap-2 min-w-[130px]">
          {isSaving ? (
            <><Loader2 className="size-4 animate-spin" /> Saving…</>
          ) : (
            <><Save className="size-4" /> Save Changes</>
          )}
        </Button>
      </div>
    </div>
  );
}
