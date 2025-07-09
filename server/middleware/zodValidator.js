const { z } = require("zod");

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

const emailOnlySchema = z.object({
  email: z.string().email("Invalid email"),
});

const passwordResetSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  email: z.string().email("Invalid email format").optional(),
});

module.exports = {
  registerSchema,
  loginSchema,
  emailOnlySchema,
  passwordResetSchema,
  updatePasswordSchema,
  updateProfileSchema,
};
