const express = require("express");
const {
  register,
  verifyEmail,
  reSendVerificationEmail,
  login,
  logout,
  refresh,
  profile,
  forgotPassword,
  resetPassword,
  updateProfile,
  updatePassword,
  deleteAccount,
} = require("../controller/authController.js");
const requireAuth = require("../middleware/requireAuth");
const rateLimiter = require("../middleware/rateLimiter.js");
const router = express.Router();

router.post("/signup", rateLimiter, register);
router.post("/login", rateLimiter, login);
router.post("/logout", rateLimiter, logout);
router.post("/resend-verification", rateLimiter, reSendVerificationEmail);
router.get("/profile", requireAuth, profile);
router.post("/refresh", refresh);
router.get("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.patch("/update-profile", requireAuth, updateProfile);
router.patch("/update-password", requireAuth, updatePassword);
router.delete("/delete-account", requireAuth, deleteAccount);

module.exports = router;
