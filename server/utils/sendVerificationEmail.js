const { generateToken } = require('./jwt');
const sendEmail = require('./sendEmail');

const sendVerificationEmail = async (user) => {
  const token = generateToken({ email: user.email }, '10m');
  user.verificationToken = token;
  await user.save();

  const link = `${process.env.CLIENT_URL}/api/auth/verify-email?token=${token}`;

  await sendEmail(
    user.email,
    'Verify Your Email',
    `<p>Hello ${user.name},<br>Please verify your email by clicking <a href="${link}">here</a>.</p>`
  );
};

module.exports = sendVerificationEmail;
