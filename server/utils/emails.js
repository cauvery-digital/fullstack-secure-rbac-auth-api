const sendEmail = require("../middleware/sendEmail.js");
const {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
} = require("./emailTemplates.js");

exports.sendVerificationEmail = async (user, verifyLink) => {
  try {
    await sendEmail(
      user.email,
      "Verify Your Email",
      VERIFICATION_EMAIL_TEMPLATE.replace("{name}", user.name)
        .replace("{link}", verifyLink)
        .replace("{verificationLink}", verifyLink)
    );
    console.log("Verification email sent successfully");
  } catch (error) {
    console.error(`Error sending verification email`, error);
    throw new Error(`Error sending verification email: ${error}`);
  }
};

exports.sendVerificationSuccessEmail = async (user) => {
  try {
    await sendEmail(
      user.email,
      "Email Verified Successfully",
      WELCOME_EMAIL_TEMPLATE.replace("{name}", user.name)
        .replace("{link}", `${process.env.CLIENT_URL}/login`)
        .replace("{contact}", `${process.env.CLIENT_URL}/contact`)
    );
    console.log("Verification success, Welcome email sent successfully");
  } catch (error) {
    console.error(`Error sending verification success email`, error);
    throw new Error(`Error sending verification success email: ${error}`);
  }
};

exports.sendWelcomeEmail = async (email, name) => {
  const recipient = email;

  try {
    await sendEmail(
      recipient,
      "Email Verified Successfully",
      WELCOME_EMAIL_TEMPLATE.replace("{name}", name)
    );

    console.log("Welcome email sent successfully");
  } catch (error) {
    console.error(`Error sending welcome email`, error);
    throw new Error(`Error sending welcome email: ${error}`);
  }
};

exports.sendPasswordResetEmail = async (email, resetURL) => {
  const recipient = email;

  try {
    await sendEmail(
      recipient,
      "Reset your password",
      PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL)
    );
    console.log("Password reset email sent successfully");
  } catch (error) {
    console.error(`Error sending password reset email`, error);
    throw new Error(`Error sending password reset email: ${error}`);
  }
};

exports.sendResetSuccessEmail = async (email, name) => {
  const recipient = email;

  try {
    await sendEmail(
      recipient,
      "Password Reset Successful",
      PASSWORD_RESET_SUCCESS_TEMPLATE.replace("{name}", name),
      "Password Reset"
    );
    console.log("Password reset email sent successfully");
  } catch (error) {
    console.error(`Error sending password reset success email`, error);
    throw new Error(`Error sending password reset success email: ${error}`);
  }
};