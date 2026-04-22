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
