import { useState, useEffect, useMemo } from "react";
import { Phone, User as UserIcon } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import api from "@/lib/axios";
import { createTransferSchema, transferSchema, type TransferFormData } from "@/lib/schemas";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldGroup, FieldError } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";

export function TransferPage() {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [fee, setFee] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validatedData, setValidatedData] = useState<TransferFormData | null>(
    null
  );
  const [feeConfig, setFeeConfig] = useState<{
    fixedFee: number;
    maxTransferAmount: number;
    minTransferAmount: number;
    percentageFee: number;
  } | null>(null);

  const schema = useMemo(() => {
    if (feeConfig) {
      return createTransferSchema(
        feeConfig.minTransferAmount,
        feeConfig.maxTransferAmount
      );
    }
    return transferSchema;
  }, [feeConfig]);

  const form = useForm<TransferFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      phone: "",
      amount: 0.0,
    },
  });

  useEffect(() => {
    let isMounted = true;
    const fetchConfig = async () => {
      try {
        const response = await api.get("/transaction/fees/config");
        if (isMounted && response.data) {
          setFeeConfig(response.data);
          // Only update if current value is 0 (untouched basically)
          const currentAmount = form.getValues("amount");
          if (currentAmount === 0) {
            form.setValue("amount", response.data.minTransferAmount, {
              shouldValidate: true,
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch fee config", error);
        toast.error("Failed to load configuration.");
      }
    };
    fetchConfig();
    return () => {
      isMounted = false;
    };
  }, [form]);

  const amountValue = form.watch("amount");

  const handleAmountAdd = (addValue: number) => {
    const currentAmount = form.getValues("amount") || 0;
    form.setValue("amount", Number((currentAmount + addValue).toFixed(2)), {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onConfirmClick = async (data: TransferFormData) => {
    if (!feeConfig) {
      toast.error("Configuration not loaded yet. Please try again.");
      return;
    }

    setValidatedData(data);
    setDrawerOpen(true);
    
    const calculatedFee = feeConfig.fixedFee + (data.amount * (feeConfig.percentageFee / 100));
    setFee(calculatedFee);
  };

  const handleSend = async () => {
    if (!validatedData) return;
    setIsSubmitting(true);

    try {
      const idempotencyKey = crypto.randomUUID();
      const response = await api.post(
        "/transaction",
        {
          receiverPhoneNumber: validatedData.phone,
          amount: validatedData.amount,
        },
        {
          headers: {
            "Idempotency-Key": idempotencyKey,
          },
        }
      );

      const transactionId = response.data?.transactionId || "N/A";
      
      // Navigate to success page with state
      navigate("/transfer/success", {
        state: {
          amount: validatedData.amount,
          recipientPhone: validatedData.phone,
          transactionId,
          date: new Date().toISOString(),
        },
        replace: true,
      });
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 500) {
          navigate("/500");
        } else if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Failed to process transaction.");
        }
      } else {
        toast.error("An unexpected error occurred.");
      }
      setDrawerOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalAmount = validatedData ? validatedData.amount + fee : 0;

  return (
    <div className="mx-auto max-w-md p-4 pt-8 pb-24">
      <form onSubmit={form.handleSubmit(onConfirmClick)} className="space-y-8 px-2">
        <FieldGroup>
          <Field data-invalid={!!form.formState.errors.phone}>
            <FieldLabel htmlFor="transfer-phone">Recipient phone number</FieldLabel>
            <InputGroup>
              <InputGroupAddon align="inline-start">
                <Phone className="size-4" />
              </InputGroupAddon>
              <InputGroupInput
                id="transfer-phone"
                placeholder="01234567890"
                type="tel"
                aria-invalid={!!form.formState.errors.phone}
                {...form.register("phone")}
              />
            </InputGroup>
            <FieldError errors={[form.formState.errors.phone]} />
          </Field>

          <Card className="border-none shadow-none bg-muted/30">
            <CardHeader className="pb-4 text-center">
              <CardTitle className="text-sm font-medium text-muted-foreground">Enter Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="relative">
                  <Controller
                    name="amount"
                    control={form.control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="number"
                        inputMode="decimal"
                        min="0"
                        step="0.1"
                        className="w-full bg-transparent text-center text-5xl font-bold tracking-tighter text-foreground outline-none placeholder:text-muted focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="0.00"
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          field.onChange(isNaN(val) ? 0 : val);
                        }}
                        value={field.value || ""}
                      />
                    )}
                  />
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 text-2xl font-bold text-primary">EGP</span>
                </div>
                {form.formState.errors.amount && (
                   <p className="text-sm text-destructive">{form.formState.errors.amount.message}</p>
                )}

                <div className="flex w-full items-center justify-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full bg-background"
                    onClick={() => handleAmountAdd(10)}
                  >
                    +10 EGP
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full bg-background"
                    onClick={() => handleAmountAdd(50)}
                  >
                    +50 EGP
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full bg-background"
                    onClick={() => handleAmountAdd(100)}
                  >
                    +100 EGP
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </FieldGroup>

        <Button
          className="w-full"
          size="lg"
          type="submit"
          disabled={!form.formState.isValid}
        >
          Confirm
        </Button>
      </form>

      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>Confirm Transfer</DrawerTitle>
              <DrawerDescription>Review your transaction details</DrawerDescription>
            </DrawerHeader>
            
            <div className="p-4 pb-0">
              <div className="mb-6 flex items-center gap-4 rounded-2xl border bg-muted/30 p-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <UserIcon className="size-6" />
                </div>
                <div className="flex flex-col">
                  <h4 className="font-semibold">{validatedData?.phone}</h4>
                  <span className="text-sm text-muted-foreground">Recipient</span>
                </div>
              </div>

              <div className="space-y-4 rounded-xl bg-muted/10 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Transfer Amount</span>
                  <span className="font-medium">{validatedData?.amount.toFixed(2)} EGP</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Transfer Fee</span>
                  <span className="font-medium">
                    {`${fee.toFixed(2)} EGP`}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total to pay</span>
                  <span className="text-lg font-bold">
                    {`${totalAmount.toFixed(2)} EGP`}
                  </span>
                </div>
              </div>
            </div>

            <DrawerFooter className="pt-6">
              <Button onClick={handleSend} disabled={isSubmitting} size="lg">
                {isSubmitting ? "Processing..." : "Confirm and Send"}
              </Button>
              <DrawerClose asChild>
                <Button variant="outline" disabled={isSubmitting} size="lg">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
