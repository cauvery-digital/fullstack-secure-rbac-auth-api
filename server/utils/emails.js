const sendEmail = require("../middleware/sendEmail.js");
const {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
} = require("./emailTemplates.js");

exports.sendVerificationEmail = async (user, verifyLink) => {
  sendEmail(
    user.email,
    "Verify Your Email",
    VERIFICATION_EMAIL_TEMPLATE.replace("{name}", user.name)
      .replace("{link}", verifyLink)
      .replace("{verificationLink}", verifyLink)
  );
};

exports.sendVerificationSuccessEmail = async (user) => {
  sendEmail(
    user.email,
    "Email Verified Successfully",
    WELCOME_EMAIL_TEMPLATE.replace("{name}", user.name)
      .replace("{link}", `${process.env.CLIENT_URL}/login`)
      .replace("{contact}", `${process.env.CLIENT_URL}/contact`)
  );
};

exports.sendWelcomeEmail = async (email, name) => {
  const recipient = email;

  try {
    const response = await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: recipient,
      subject: "Email Verified Successfully",
      html: WELCOME_EMAIL_TEMPLATE.replace("{name}", name),
    });

    console.log("Welcome email sent successfully", response);
  } catch (error) {
    console.error(`Error sending welcome email`, error);

    throw new Error(`Error sending welcome email: ${error}`);
  }
};

exports.sendPasswordResetEmail = async (email, resetURL) => {
  const recipient = email;

  try {
    const response = await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: recipient,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Password Reset",
    });
  } catch (error) {
    console.error(`Error sending password reset email`, error);

    throw new Error(`Error sending password reset email: ${error}`);
  }
};

exports.sendResetSuccessEmail = async (email, name) => {
  const recipient = email;

  try {
    const response = await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: recipient,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE.replace("{name}", name),
      category: "Password Reset",
    });

    console.log("Password reset email sent successfully", response);
  } catch (error) {
    console.error(`Error sending password reset success email`, error);

    throw new Error(`Error sending password reset success email: ${error}`);
  }
};
