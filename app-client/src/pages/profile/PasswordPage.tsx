import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { Lock, ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react";

import api from "@/lib/axios";
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from "@/lib/schemas";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldLabel,
  FieldGroup,
  FieldError,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
} from "@/components/ui/input-group";

function handleAxiosError(error: unknown, navigate: (path: string) => void) {
  if (isAxiosError(error)) {
    if (error.response?.status === 500) {
      navigate("/500");
    } else if (error.response?.data?.errors) {
      const errors = error.response.data.errors as {
        field: string;
        message: string;
      }[];
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

export function PasswordPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      setLoading(true);
      await api.patch("/auth/change-password", {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
      toast.success("Password updated successfully");
      navigate("/profile");
    } catch (error) {
      handleAxiosError(error, navigate);
      console.error("Failed to update password:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full min-h-[calc(100vh-9rem)] flex-col bg-muted/30">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center border-b bg-background p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="mr-2"
        >
          <ArrowLeft className="size-5" />
        </Button>
        <h1 className="text-lg font-semibold">Change Password</h1>
      </div>

      <div className="flex flex-1 flex-col space-y-8 bg-background p-6">

        <form
          id="password-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto w-full max-w-md space-y-4"
        >
          <FieldGroup>
            <Field data-invalid={!!form.formState.errors.oldPassword}>
              <FieldLabel htmlFor="oldPassword">Current Password</FieldLabel>
              <InputGroup>
                <InputGroupAddon align="inline-start">
                  <Lock />
                </InputGroupAddon>
                <InputGroupInput
                  id="oldPassword"
                  type={showOldPassword ? "text" : "password"}
                  placeholder="Enter current password"
                  aria-invalid={!!form.formState.errors.oldPassword}
                  {...form.register("oldPassword")}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    title="Toggle password visibility"
                    type="button"
                  >
                    {showOldPassword ? <EyeOff /> : <Eye />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              <FieldError errors={[form.formState.errors.oldPassword]} />
            </Field>

            <Field data-invalid={!!form.formState.errors.newPassword}>
              <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
              <InputGroup>
                <InputGroupAddon align="inline-start">
                  <Lock />
                </InputGroupAddon>
                <InputGroupInput
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  aria-invalid={!!form.formState.errors.newPassword}
                  {...form.register("newPassword")}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    title="Toggle password visibility"
                    type="button"
                  >
                    {showNewPassword ? <EyeOff /> : <Eye />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              <FieldError errors={[form.formState.errors.newPassword]} />
            </Field>

            <Field data-invalid={!!form.formState.errors.confirmPassword}>
              <FieldLabel htmlFor="confirmPassword">
                Confirm New Password
              </FieldLabel>
              <InputGroup>
                <InputGroupAddon align="inline-start">
                  <Lock />
                </InputGroupAddon>
                <InputGroupInput
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  aria-invalid={!!form.formState.errors.confirmPassword}
                  {...form.register("confirmPassword")}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    title="Toggle password visibility"
                    type="button"
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              <FieldError errors={[form.formState.errors.confirmPassword]} />
            </Field>
          </FieldGroup>
        </form>
      </div>

      {/* Bottom Section */}
      <div className="sticky bottom-0 mt-auto border-t bg-background p-4">
        <Button
          form="password-form"
          type="submit"
          className="h-12 w-full cursor-pointer text-base font-semibold"
          disabled={
            loading ||
            !form.formState.isDirty ||
            form.watch("oldPassword") === form.watch("newPassword")
          }
        >
          {loading ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            "Save Password"
          )}
        </Button>
      </div>
    </div>
  );
}
