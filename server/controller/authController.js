const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const {
  generateToken,
  verifyToken,
  signAccessToken,
  signRefreshToken,
} = require("../utils/jwt.js");
// const sendEmail = require("../utils/sendEmail.js");
const {
  sendVerificationEmail,
  sendVerificationSuccessEmail
} = require('../utils/emails.js');

// This function handles user registration, including email verification.

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists)
    return res.status(400).json({ error: "Email already in use" });

  const verificationToken = generateToken({ email }, "10m");

  const user = await User.create({ name, email, password, verificationToken });

  const verifyLink = `${process.env.CLIENT_URL}/api/auth/verify-email?token=${verificationToken}`;
  await sendVerificationEmail(user);
  // await sendEmail(
  //   email,
  //   "Verify your email",
  //   `<p>Click to verify: <a href="${verifyLink}">Verify Email</a></p>`
  // );

  res.status(201).json({
			success: true,
			message: "User created successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
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
      // await sendEmail(
      //   user.email,
      //   'Email Verified Successfully',
      //   `<p>Hello ${user.name},<br>Your email has been verified successfully!</p>`
      // );
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
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
  });

  res.json({ 
    id: user._id,
    name: user.name,
    email: user.email, accessToken });
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

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
  });

  res.status(202).json({ success: "sucessfully logedout" }); // No Content
};

exports.profile = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ email: user.email, name: user.name })
};

exports.reSendVerificationEmail = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (user.isVerified)
    return res.status(400).json({ error: 'Email already verified' });

  try {
    await sendVerificationEmail(user);
    res.json({ message: 'Verification email resent successfully' });
  } catch (err) {
    console.error('Error sending email:', err);
    res.status(500).json({ error: 'Failed to resend verification email' });
  }
}

exports.forgotPassword = async (req, res) => {
	const { email } = req.body;
	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		// Generate reset token
		const resetToken = crypto.randomBytes(20).toString("hex");
		const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

		user.resetPasswordToken = resetToken;
		user.resetPasswordExpiresAt = resetTokenExpiresAt;

		await user.save();

		// send email
		await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

		res.status(200).json({ success: true, message: "Password reset link sent to your email" });
	} catch (error) {
		console.log("Error in forgotPassword ", error);
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

		// update password
		const hashedPassword = await bcryptjs.hash(password, 10);

		user.password = hashedPassword;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpiresAt = undefined;
		await user.save();

		await sendResetSuccessEmail(user.email);

		res.status(200).json({ success: true, message: "Password reset successful" });
	} catch (error) {
		console.log("Error in resetPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};
