const sendEmail = require('../middleware/sendEmail.js');
const {
	PASSWORD_RESET_REQUEST_TEMPLATE,
	PASSWORD_RESET_SUCCESS_TEMPLATE,
	VERIFICATION_EMAIL_TEMPLATE,
	WELCOME_EMAIL_TEMPLATE,
} = require('./emailTemplates.js');

exports.sendVerificationEmail = async (user, verifyLink) => {
	try {
		await sendEmail(
			user.email,
			'Verify your email address',
			VERIFICATION_EMAIL_TEMPLATE.replace("{name}", user.name).replace("{link}", verifyLink).replace("{verificationLink}", verifyLink)
		);
		console.log("Verification email sent successfully");
	} catch (error) {
		console.error(`Error sending verification email`, error);
		throw new Error(`Error sending verification email: ${error}`);
	}
};

exports.sendVerificationSuccessEmail = async (user) => {
	const recipient = user.email;

	try {
		await sendEmail(
			recipient,
			"Email Verified Successfully",
			WELCOME_EMAIL_TEMPLATE.replace("{name}", user.name).replace("{login_url}", process.env.CLIENT_URL + '/login').replace("{support_url}", process.env.CLIENT_URL + '/contact')
		);
		console.log("Verification success email sent successfully");
	} catch (error) {
		console.error(`Error sending verification success email`, error);
		throw new Error(`Error sending verification success email: ${error}`);
	}
};

exports.sendPasswordResetEmail = async (user, resetURL) => {
	const recipient = user.email;

	try {
		await sendEmail(
			recipient,
			'Reset your password',
			PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
		);
		console.log("Password reset email sent successfully");
	} catch (error) {
		console.error(`Error sending password reset email`, error);
		throw new Error(`Error sending password reset email: ${error}`);
	}
};

exports.sendResetSuccessEmail = async (user) => {
	const recipient = user.email;

	try {
		await sendEmail(
			recipient,
			"Password Reset Successful",
			PASSWORD_RESET_SUCCESS_TEMPLATE.replace("{name}", user.name),
		);
		console.log("Password reset success email sent successfully");
	} catch (error) {
		console.error(`Error sending password reset success email`, error);
		throw new Error(`Error sending password reset success email: ${error}`);
	}
};
