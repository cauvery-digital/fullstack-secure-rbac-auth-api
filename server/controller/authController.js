// controllers/authController.js

const User = require("../models/User.js");
const crypto = require("crypto");
const {
  generateToken,
  verifyToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwt.js");
const {
  sendVerificationEmail,
  sendVerificationSuccessEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} = require("../utils/emails.js");
const {
  registerSchema,
  loginSchema,
  emailOnlySchema,
  passwordResetSchema,
  updatePasswordSchema,
  updateProfileSchema,
} = require("../middleware/zodValidator.js");


exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ error: "Email already in use" });

    const verificationToken = generateToken({ email }, "10m");
    const user = await User.create({ name, email, password, verificationToken });
    const verifyLink = `${process.env.CLIENT_URL}/api/auth/verify-email?token=${verificationToken}`;

    await sendVerificationEmail(user, verifyLink);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
};

exports.verifyEmail = async (req, res) => {
  const { token } = req.query;
  try {
    const { email } = verifyToken(token);
    const user = await User.findOne({ email });
    if (!user || user.isVerified)
      return res.status(400).json({ error: "Invalid or already verified" });

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();
    await sendVerificationSuccessEmail(user);

    res.json({ message: "Email verified successfully" });
  } catch {
    res.status(400).json({ error: "Invalid or expired token" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password +refreshToken");
  if (!user || !user.isVerified) {
    return res
      .status(403)
      .json({ error: "Invalid credentials or unverified email" });
  }

  const valid = await user.comparePassword(password);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  const accessToken = signAccessToken(user._id);
  const refreshToken = signRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    success: true,
    message: "Logged in successfully",
    user: { ...user._doc, password: undefined },
    accessToken,
  });
};

exports.refresh = async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) return res.status(401).json({ error: "Missing refresh token" });

  try {
    const { id } = verifyRefreshToken(token);
    const user = await User.findById(id).select("+refreshToken");

    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ error: "Invalid refresh token" });
    }

    const newAccessToken = signAccessToken(id);
    const newRefreshToken = signRefreshToken(id);

    user.refreshToken = newRefreshToken;
    await user.save();

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({ error: "Invalid or expired token" });
  }
};

exports.logout = async (req, res) => {
  const token = req.cookies?.refreshToken;

  try {
    if (token) {
      const { id } = verifyRefreshToken(token);
      const user = await User.findById(id);
      if (user) {
        user.refreshToken = null;
        await user.save();
      }
    }
  } catch (err) {}

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });

  res.status(202).json({ success: "Successfully logged out" });
};

exports.profile = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ email: user.email, name: user.name });
};

exports.reSendVerificationEmail = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "User not found" });

  if (user.isVerified)
    return res.status(400).json({ error: "Email already verified" });

  try {
    await sendVerificationEmail(user);
    res.json({ message: "Verification email resent successfully" });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({ error: "Failed to resend verification email" });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 60 * 60 * 1000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;
    await user.save();

    await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

    res.status(200).json({ success: true, message: "Password reset link sent to your email" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    await sendResetSuccessEmail(user.email);

    res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  const { name, email } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;
    await user.save();

    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile" });
  }
};

exports.updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).select("+password");
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(401).json({ error: "Current password is incorrect" });

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update password" });
  }
};

exports.deleteAccount = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete account" });
  }
};
