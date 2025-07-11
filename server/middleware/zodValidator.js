const { z } = require("zod");

// Email must match RFC standard and allow alphanumeric + dots + underscores before @
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Password: 6-64 characters, at least 1 lowercase, 1 uppercase, 1 digit, 1 special char
const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9])[A-Za-z\\d@$!%*?&^#_~]{6,64}$/;

const emailRules = z
  .string()
  .min(5, "Email is too short")
  .max(100, "Email is too long")
  .regex(emailPattern, "Invalid email format");

const passwordRules = z
  .string()
  .regex(passwordPattern, {
    message:
      "Password must be 6–64 characters, include upper and lower case letters, a number, and a special character",
  });

const registerSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: emailRules,
  password: passwordRules,
});

const loginSchema = z.object({
  email: emailRules,
  password: z.string().min(1, "Password is required"),
});

const emailOnlySchema = z.object({
  email: emailRules,
});

const passwordResetSchema = z.object({
  password: passwordRules,
});

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: passwordRules,
});

const updateProfileSchema = z.object({
  name: z.string().trim().min(1, "Name is required").optional(),
  email: emailRules.optional(),
});

module.exports = {
  registerSchema,
  loginSchema,
  emailOnlySchema,
  passwordResetSchema,
  updatePasswordSchema,
  updateProfileSchema,
};
