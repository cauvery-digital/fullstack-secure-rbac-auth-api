exports.VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify Your Email</title>
    <style>
      button {
        background-color: #4169e1;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 5px;
        cursor: pointer;
      }
      button:hover {
        background-color: #1c2f69;
      }
      p {
        font-size: 14px;
      }
    </style>
  </head>
  <body
    style="
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    "
  >
    <div
      style="
        background: #4169e1;
        padding: 20px;
        text-align: center;
      "
    >
      <h1 style="color: white; margin: 0">Verify Your Email</h1>
    </div>
    <div
      style="
        background-color: #f9f9f9;
        padding: 20px;
        border-radius: 0 0 5px 5px;
        box-shadow: 0 2px 5px #000000;
      "
    >
      <h2>Hello!, {name}</h2>
      <p>Thank you for signing up!</p>
      <div style="text-align: center; margin: 30px 0">
        <span style="font-size: 20px; font-weight: bold; color: #4169e1;"
          >Please verify your email by clicking the button below:</span
        >
        <div style="margin-top: 20px">
          <button>
            <a
              style="color: #ffffff; text-decoration: none; font-weight: bold;font-size: 18px"
              href="{link}"
              >Verify Email</a
            >
          </button>
        </div>
      </div>
      <p>
        If link is not working, please copy and paste the following URL into
        your browser:
      </p>
      <div
        style="
          box-sizing: border-box 1px solid;
          padding: 10px;
          margin: 20px 0;
          border-radius: 5px;
          background-color: #f1f1f1;
        ">
        <p><a style="color: #191970; text-decoration: none;" href="#">{verificationLink}</a></p>
      </div>
      <p>This link will expire in 15 minutes for security reasons.</p>
      <p>If you didn't create an account with us, please ignore this email.</p>
      <p>Best regards,<br />GEI Team</p>
    </div>
    <div
      style="
        text-align: center;
        margin-top: 20px;
        color: #888;
        font-size: 0.8em;
      "
    >
      <p>This is an automated message, please do not reply to this email.</p>
    </div>
  </body>
</html>
`;

exports.PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Successful</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Password Reset Successful</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>We're writing to confirm that your password has been successfully reset.</p>
    <div style="text-align: center; margin: 30px 0;">
      <div style="background-color: #4CAF50; color: white; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; display: inline-block; font-size: 30px;">
        ✓
      </div>
    </div>
    <p>If you did not initiate this password reset, please contact our support team immediately.</p>
    <p>For security reasons, we recommend that you:</p>
    <ul>
      <li>Use a strong, unique password</li>
      <li>Enable two-factor authentication if available</li>
      <li>Avoid using the same password across multiple sites</li>
    </ul>
    <p>Thank you for helping us keep your account secure.</p>
    <p>Best regards,<br>Your App Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

exports.PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Password Reset</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello!</p>
    <p>We received a request to reset your password. If you didn't make this request, please ignore this email.</p>
    <p>To reset your password, click the button below:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{resetURL}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
    </div>
    <p>This link will expire in 1 hour for security reasons.</p>
    <p>Best regards,<br>GEI Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;
exports.WELCOME_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Email Verified Successfully</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </style>
  <style>
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; padding: 20px !important; }
      .button { width: 100% !important; display: block !important; }
    }
    .button:hover {
      background-color: #2c80d3 !important;
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f6f8fa; font-family: Arial, sans-serif;">
  <table width="100%" cellspacing="0" cellpadding="0" bgcolor="#f6f8fa">
    <tr>
      <td align="center" style="padding: 40px 10px;">
        <table class="container" width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 8px; overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background-color: royalblue; padding: 30px; text-align: center;">
           <!-- <img src="https://yourdomain.com/logo.png" alt="Your Logo" width="120" style="margin-bottom: 20px;" /> -->

              <h1 style="margin: 0; font-size: 24px; color: #ffffff;">Welcome to GEI</h1>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td style="padding: 30px; color: #333;">
              <p style="font-size: 18px; margin: 0 0 20px; font-weight:bold;">
                Hi {name},
              </p>
              <p style="font-size: 16px; margin: 0 0 20px;">
                Your email address has been successfully verified. You’re all set to get started with your account.
              </p>
              <p style="font-size: 16px; margin: 0 0 30px;">
                Click the button below to log in and explore everything we offer.
              </p>

              <!-- Login Button -->
              <div style="text-align: center; margin-bottom: 30px;">
                <a href="{link}" class="button" style="background-color: royalblue; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 5px; font-size: 16px;">
                  Log In to Your Account
                </a>
              </div>

              <p style="font-size: 14px; color: #555;">
                If you have any questions, feel free to <a href="{contact}" style="color: #2c3e50; text-decoration: underline;">contact our support team</a>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #ecf0f1; padding: 20px; text-align: center; font-size: 12px; color: #7f8c8d;">
              &copy; 2025 GEI. All rights reserved.<br>
              123 Web Street, Tech City, India
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

exports.WELCOME_EMAIL_TEMPLATE1 = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Email Verified</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; padding: 20px !important; }
      .btn { width: 100% !important; display: block !important; }
    }

    /* Hover effect using <style>: supported in most modern clients */
    .btn:hover {
      background-color: #2c80d3 !important;
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" bgcolor="#f4f4f4">
    <tr>
      <td align="center" style="padding: 40px 10px;">
        <table class="container" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #2c3e50; padding: 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px; color: #ffffff;">Email Verified Successfully</h1>
              <p style="margin: 10px 0 0; color: #bdc3c7;">Welcome to [Your Company]</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 30px; color: #333;">
              <p style="font-size: 16px; margin: 0 0 20px;">Hi {{first_name | there}},</p>
              <p style="font-size: 16px; margin: 0 0 20px;">
                Your email address has been successfully verified. You’re all set to begin using your account.
              </p>
              <p style="font-size: 16px; margin: 0 0 30px;">
                Click the button below to log in and start exploring your dashboard.
              </p>

              <!-- Button -->
              <div style="text-align: center; margin-bottom: 30px;">
                <a href="{{login_url}}"
                   class="btn"
                   style="background-color: #3498db; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block; transition: background-color 0.3s;">
                  Log In to Your Account
                </a>
              </div>

              <p style="font-size: 14px; color: #555;">
                If you have any questions, visit our <a href="{{support_url}}" style="color: #2c3e50; text-decoration: underline;">support center</a>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #ecf0f1; padding: 20px; text-align: center; font-size: 12px; color: #7f8c8d;">
              © {{year}} [Your Company]. All rights reserved.<br>
              123 Web Avenue, Tech City, India
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;