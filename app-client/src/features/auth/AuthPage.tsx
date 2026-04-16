import { useState } from "react";
import { Wallet, Phone, Lock, Eye, EyeOff } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
} from "@/components/ui/input-group";

export function AuthPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

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

            <TabsContent value="login" className="space-y-6">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="login-phone">Phone number</FieldLabel>
                  <InputGroup>
                    <InputGroupAddon align="inline-start">
                      <Phone />
                    </InputGroupAddon>
                    <InputGroupInput
                      id="login-phone"
                      placeholder="01234567890"
                      type="tel"
                    />
                  </InputGroup>
                </Field>

                <Field>
                  <FieldLabel htmlFor="login-password">Password</FieldLabel>
                  <InputGroup>
                    <InputGroupAddon align="inline-start">
                      <Lock />
                    </InputGroupAddon>
                    <InputGroupInput
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        onClick={togglePassword}
                        title="Toggle password visibility"
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                </Field>
              </FieldGroup>

              <Button className="mt-6 w-full" size="lg">
                Login
              </Button>
            </TabsContent>

            <TabsContent value="signup" className="space-y-6">
              <FieldGroup>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="signup-first-name">
                      First name
                    </FieldLabel>
                    <Input id="signup-first-name" placeholder="John" />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="signup-last-name">
                      Last name
                    </FieldLabel>
                    <Input id="signup-last-name" placeholder="Doe" />
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="signup-phone">Phone number</FieldLabel>
                  <InputGroup>
                    <InputGroupAddon align="inline-start">
                      <Phone />
                    </InputGroupAddon>
                    <InputGroupInput
                      id="signup-phone"
                      placeholder="01234567890"
                      type="tel"
                    />
                  </InputGroup>
                </Field>

                <Field>
                  <FieldLabel htmlFor="signup-password">Password</FieldLabel>
                  <InputGroup>
                    <InputGroupAddon align="inline-start">
                      <Lock />
                    </InputGroupAddon>
                    <InputGroupInput
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        onClick={togglePassword}
                        title="Toggle password visibility"
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                </Field>

                <Field>
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
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        onClick={toggleConfirmPassword}
                        title="Toggle password visibility"
                      >
                        {showConfirmPassword ? <EyeOff /> : <Eye />}
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                </Field>
              </FieldGroup>

              <Button className="mt-6 w-full" size="lg">
                Create Account
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
