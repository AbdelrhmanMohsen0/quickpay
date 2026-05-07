import { useState } from "react";
import { Wallet, Phone, Lock, Eye, EyeOff, ShieldX, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { NotAdminError } from "@/lib/errors";

import { useAuth } from "@/app/hooks/useAuth";
import {
  loginSchema,
  type LoginFormData,
} from "@/lib/schemas.ts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldGroup, FieldError } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
} from "@/components/ui/input-group";
import { useNavigate, Navigate } from "react-router-dom";

function handleAxiosError(error: unknown, navigate: (path: string) => void) {
  if (isAxiosError(error)) {
    if (error.response?.status === 500) {
      navigate("/500");
    } else if (error.response?.data?.errors) {
      const errors = error.response.data.errors as { field: string; message: string }[];
      const firstError = errors?.[0]?.message;
      toast.error(firstError || "An unexpected error occurred.");
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error("An unexpected error occurred.");
    }
  } else {
    toast.error("An unexpected error occurred.");
  }
}

export function AuthPage() {
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const togglePassword = () => setShowPassword(!showPassword);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      await login({ phoneNumber: data.phone, password: data.password });
      navigate("/admin/", { replace: true });
    } catch (error) {
      if (error instanceof NotAdminError) {
        setAccessDenied(true);
        return;
      }
      handleAxiosError(error, navigate);
      console.error("Login failed:", error);
    }
  };

  if (loading) return null;
  if (user && user.status === "ACTIVE") return <Navigate to="/admin/" replace />;

  // Access denied screen
  if (accessDenied) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
        <Card className="w-full max-w-md px-3 py-10 shadow-lg text-center">
          <CardContent className="flex flex-col items-center gap-6 pt-6">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-destructive/10">
              <ShieldX className="size-8 text-destructive" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold tracking-tight">Access Denied</h2>
              <p className="text-sm text-muted-foreground">
                This dashboard is restricted to admin accounts only.
                Your account does not have the required permissions.
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setAccessDenied(false)}
            >
              <ArrowLeft data-icon="inline-start" />
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md px-3 py-10 shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <div className="mb-2 flex justify-center">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Wallet className="size-6" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            QuickPay
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Fast, secure, and reliable payments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="mb-6 grid w-full grid-cols-1">
              <TabsTrigger value="login">Login</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form
                onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                className="space-y-6"
              >
                <FieldGroup>
                  <Field data-invalid={!!loginForm.formState.errors.phone}>
                    <FieldLabel htmlFor="login-phone">Phone number</FieldLabel>
                    <InputGroup>
                      <InputGroupAddon align="inline-start">
                        <Phone />
                      </InputGroupAddon>
                      <InputGroupInput
                        id="login-phone"
                        placeholder="01234567890"
                        type="tel"
                        aria-invalid={!!loginForm.formState.errors.phone}
                        {...loginForm.register("phone")}
                      />
                    </InputGroup>
                    <FieldError errors={[loginForm.formState.errors.phone]} />
                  </Field>

                  <Field data-invalid={!!loginForm.formState.errors.password}>
                    <FieldLabel htmlFor="login-password">Password</FieldLabel>
                    <InputGroup>
                      <InputGroupAddon align="inline-start">
                        <Lock />
                      </InputGroupAddon>
                      <InputGroupInput
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        aria-invalid={!!loginForm.formState.errors.password}
                        {...loginForm.register("password")}
                      />
                      <InputGroupAddon align="inline-end">
                        <InputGroupButton
                          onClick={togglePassword}
                          title="Toggle password visibility"
                          type="button"
                        >
                          {showPassword ? <EyeOff /> : <Eye />}
                        </InputGroupButton>
                      </InputGroupAddon>
                    </InputGroup>
                    <FieldError errors={[loginForm.formState.errors.password]} />
                  </Field>
                </FieldGroup>

                <Button
                  className="mt-6 w-full"
                  size="lg"
                  type="submit"
                  disabled={loginForm.formState.isSubmitting}
                >
                  {loginForm.formState.isSubmitting ? "Logging in..." : "Login"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
