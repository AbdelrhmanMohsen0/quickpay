import { useState } from "react";
import { Wallet, Phone, Lock, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { isAxiosError } from "axios";

import { useAuth } from "@/app/hooks/useAuth";
import {
  loginSchema,
  type LoginFormData,
  signupSchema,
  type SignupFormData,
} from "@/lib/schemas";

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
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
} from "@/components/ui/input-group";
import { useNavigate } from "react-router-dom";

export function AuthPage() {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      await login({ phoneNumber: data.phone, password: data.password });
      navigate("/", { replace: true });
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 500) {
          navigate("/500");
        } else if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("An unexpected error occurred.");
        }
      } else {
        toast.error("An unexpected error occurred.");
      }
      console.error("Login failed:", error);
    }
  };

  const onSignupSubmit = async (data: SignupFormData) => {
    try {
      await signup({
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phone,
        password: data.password,
      });
      navigate("/", { replace: true });
    } catch (error) {
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
      console.error("Signup failed:", error);
    }
  };

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
            <TabsList className="mb-6 grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
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

            <TabsContent value="signup">
              <form
                onSubmit={signupForm.handleSubmit(onSignupSubmit)}
                className="space-y-6"
              >
                <FieldGroup>
                  <div className="grid grid-cols-2 gap-4">
                    <Field data-invalid={!!signupForm.formState.errors.firstName}>
                      <FieldLabel htmlFor="signup-first-name">
                        First name
                      </FieldLabel>
                      <Input
                        id="signup-first-name"
                        placeholder="John"
                        aria-invalid={!!signupForm.formState.errors.firstName}
                        {...signupForm.register("firstName")}
                      />
                      <FieldError
                        errors={[signupForm.formState.errors.firstName]}
                      />
                    </Field>
                    <Field data-invalid={!!signupForm.formState.errors.lastName}>
                      <FieldLabel htmlFor="signup-last-name">Last name</FieldLabel>
                      <Input
                        id="signup-last-name"
                        placeholder="Doe"
                        aria-invalid={!!signupForm.formState.errors.lastName}
                        {...signupForm.register("lastName")}
                      />
                      <FieldError
                        errors={[signupForm.formState.errors.lastName]}
                      />
                    </Field>
                  </div>

                  <Field data-invalid={!!signupForm.formState.errors.phone}>
                    <FieldLabel htmlFor="signup-phone">Phone number</FieldLabel>
                    <InputGroup>
                      <InputGroupAddon align="inline-start">
                        <Phone />
                      </InputGroupAddon>
                      <InputGroupInput
                        id="signup-phone"
                        placeholder="01234567890"
                        type="tel"
                        aria-invalid={!!signupForm.formState.errors.phone}
                        {...signupForm.register("phone")}
                      />
                    </InputGroup>
                    <FieldError errors={[signupForm.formState.errors.phone]} />
                  </Field>

                  <Field data-invalid={!!signupForm.formState.errors.password}>
                    <FieldLabel htmlFor="signup-password">Password</FieldLabel>
                    <InputGroup>
                      <InputGroupAddon align="inline-start">
                        <Lock />
                      </InputGroupAddon>
                      <InputGroupInput
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        aria-invalid={!!signupForm.formState.errors.password}
                        {...signupForm.register("password")}
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
                    <FieldError
                      errors={[signupForm.formState.errors.password]}
                    />
                  </Field>

                  <Field
                    data-invalid={!!signupForm.formState.errors.confirmPassword}
                  >
                    <FieldLabel htmlFor="signup-confirm-password">
                      Confirm Password
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupAddon align="inline-start">
                        <Lock />
                      </InputGroupAddon>
                      <InputGroupInput
                        id="signup-confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        aria-invalid={!!signupForm.formState.errors.confirmPassword}
                        {...signupForm.register("confirmPassword")}
                      />
                      <InputGroupAddon align="inline-end">
                        <InputGroupButton
                          onClick={toggleConfirmPassword}
                          title="Toggle password visibility"
                          type="button"
                        >
                          {showConfirmPassword ? <EyeOff /> : <Eye />}
                        </InputGroupButton>
                      </InputGroupAddon>
                    </InputGroup>
                    <FieldError
                      errors={[signupForm.formState.errors.confirmPassword]}
                    />
                  </Field>
                </FieldGroup>

                <Button
                  className="mt-6 w-full"
                  size="lg"
                  type="submit"
                  disabled={signupForm.formState.isSubmitting}
                >
                  {signupForm.formState.isSubmitting
                    ? "Creating Account..."
                    : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
