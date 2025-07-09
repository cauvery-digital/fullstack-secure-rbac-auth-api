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
const router = express.Router();

router.post("/signup", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/resend-verification", reSendVerificationEmail);
router.get("/profile", requireAuth, profile);
router.post("/refresh", refresh);
router.get("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.patch("/update-profile", requireAuth, updateProfile);
router.patch("/update-password", requireAuth, updatePassword);
router.delete("/delete-account", requireAuth, deleteAccount);

module.exports = router;
