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

// const express = require("express");
// const router = express.Router();
// const authController = require("../controllers/authController");
// const { protect } = require("../middleware/authMiddleware");

// // Public routes
// router.post("/register", authController.register);
// router.get("/verify-email", authController.verifyEmail);
// router.post("/login", authController.login);
// router.post("/refresh", authController.refresh);
// router.post("/logout", authController.logout);
// router.post("/forgot-password", authController.forgotPassword);
// router.post("/reset-password/:token", authController.resetPassword);
// router.post("/resend-verification", authController.reSendVerificationEmail);

// // Protected routes
// router.get("/profile", protect, authController.profile);
// router.put("/profile", protect, authController.updateProfile);
// router.put("/update-password", protect, authController.updatePassword);
// router.delete("/delete-account", protect, authController.deleteAccount);

// module.exports = router;

