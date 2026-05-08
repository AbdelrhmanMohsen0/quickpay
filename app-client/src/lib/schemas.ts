import { z } from "zod";

export const loginSchema = z.object({
  phone: z
    .string()
    .length(11, "Phone must be 11 digits")
    .regex(/^01[0-9]{9}$/, "Invalid Egyptian phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    phone: z
      .string()
      .length(11, "Phone must be 11 digits")
      .regex(/^01[0-9]{9}$/, "Invalid Egyptian phone number"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Confirm password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupFormData = z.infer<typeof signupSchema>;

export const transferSchema = z.object({
  phone: z
    .string()
    .length(11, "Phone must be 11 digits")
    .regex(/^01[0-9]{9}$/, "Invalid Egyptian phone number"),
  amount: z
    .number()
    .positive("Amount must be greater than 0")
    .min(1, "Minimum transfer amount is 1 EGP"),
});

export type TransferFormData = z.infer<typeof transferSchema>;

export const createTransferSchema = (minAmount: number, maxAmount: number) => z.object({
  phone: z
    .string()
    .length(11, "Phone must be 11 digits")
    .regex(/^01[0-9]{9}$/, "Invalid Egyptian phone number"),
  amount: z
    .number()
    .positive("Amount must be greater than 0")
    .min(minAmount, `Minimum transfer amount is ${minAmount} EGP`)
    .max(maxAmount, `Maximum transfer amount is ${maxAmount} EGP`),
});

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(8, "Current password must be at least 8 characters"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm new password must be at least 8 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
