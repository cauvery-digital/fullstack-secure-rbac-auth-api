# How to develop a backend server more securely. step by step, in brief, with code by using express, cors, mongoose, validator, dotenv, nodemailer,and  helmet with email verification service

To develop a secure backend server using **Express**, **Mongoose**, **dotenv**, **CORS**, **validator**, **nodemailer**, and **helmet** — with email verification — follow this step-by-step guide:

---

## ✅ 1. Project Setup

```bash
npm init -y
npm install express mongoose dotenv cors helmet nodemailer validator bcrypt jsonwebtoken cookie-parser
```

---

## ✅ 2. Folder Structure

```bash
/secure-server
├── app.js
├── .env
├── models/User.js
├── routes/auth.js
├── utils/sendEmail.js
├── utils/jwt.js
```

---

## ✅ 3. Configure `.env`

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/secureApp
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password_or_app_password
```

---

## ✅ 4. Initialize Express App (`app.js`)

```js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ DB Connected');
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
  })
  .catch(err => console.error('❌ DB Error:', err));
```

---

## ✅ 5. Mongoose User Model (`models/User.js`)

```js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    validate: [validator.isAlpha, 'Only alphabets allowed'],
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: [validator.isEmail, 'Invalid email'],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('User', userSchema);
```

---

## ✅ 6. JWT Utility (`utils/jwt.js`)

```js
const jwt = require('jsonwebtoken');

exports.generateToken = (payload, expiresIn = '1h') =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });

exports.verifyToken = (token) =>
  jwt.verify(token, process.env.JWT_SECRET);
```

---

## ✅ 7. Email Utility (`utils/sendEmail.js`)

```js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports = async function sendEmail(to, subject, html) {
  await transporter.sendMail({
    from: `"Secure App" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};
```

---

## ✅ 8. Auth Routes (`routes/auth.js`)

```js
const express = require('express');
const User = require('../models/User');
const { generateToken, verifyToken } = require('../utils/jwt');
const sendEmail = require('../utils/sendEmail');
const router = express.Router();

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ error: 'Email already in use' });

  const verificationToken = generateToken({ email }, '10m');

  const user = await User.create({ name, email, password, verificationToken });

  const verifyLink = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;

  await sendEmail(email, 'Verify your email', `<p>Click to verify: <a href="${verifyLink}">Verify Email</a></p>`);

  res.json({ message: 'Verification email sent' });
});

router.get('/verify-email', async (req, res) => {
  const { token } = req.query;
  try {
    const { email } = verifyToken(token);
    const user = await User.findOne({ email });
    if (!user || user.isVerified) return res.status(400).json({ error: 'Invalid or already verified' });

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch {
    res.status(400).json({ error: 'Invalid or expired token' });
  }
});
```

---

## ✅ 9. Secure Best Practices

| Step                  | Practice                                                       |
| --------------------- | -------------------------------------------------------------- |
| 1. CORS               | Only allow trusted origins (`credentials: true`)               |
| 2. Helmet             | Add security headers                                           |
| 3. HTTPS              | Use HTTPS in production                                        |
| 4. Dotenv             | Keep secrets out of code (`.env`)                              |
| 5. Email verification | Required before login/session                                  |
| 6. Password hashing   | Use `bcrypt`                                                   |
| 7. XSS prevention     | Sanitize inputs (use `express-validator` optionally)           |
| 8. Rate limiting      | Use `express-rate-limit` (optional) for brute force protection |

---

Let me know if you want:

* Login & JWT access/refresh logic
* Password reset flow
* Resend verification email
* Frontend example or testing setup

I can build next steps for you.

## Login & JWT access/refresh logic

Here’s how to implement secure **Login with JWT access & refresh token logic** in your Express backend — including secure `httpOnly` cookie usage for refresh tokens and short-lived access tokens.

---

## ✅ Flow Summary

1. **User logs in**: get access & refresh tokens
2. **Access token**: short-lived (15m), sent in header
3. **Refresh token**: long-lived (7d), sent via `httpOnly` cookie
4. **Refresh route**: gets new access token
5. **Logout**: clears refresh token cookie

---

## 🧠 Update `.env`

```env
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

---

## 🧠 Update `User.js` Model (Mongoose)

```js
refreshToken: {
  type: String,
  select: false
}
```

---

## ⚙️ `utils/jwt.js`

```js
const jwt = require('jsonwebtoken');

exports.signAccessToken = (id) =>
  jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
  });

exports.signRefreshToken = (id) =>
  jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });

exports.verifyAccessToken = (token) =>
  jwt.verify(token, process.env.JWT_ACCESS_SECRET);

exports.verifyRefreshToken = (token) =>
  jwt.verify(token, process.env.JWT_REFRESH_SECRET);
```

---

## 🔑 `POST /api/auth/login`

```js
const router = require('express').Router();
const User = require('../models/User');
const { signAccessToken, signRefreshToken } = require('../utils/jwt');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password +refreshToken');
  if (!user || !user.isVerified) {
    return res.status(403).json({ error: 'Invalid credentials or unverified email' });
  }

  const valid = await user.comparePassword(password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const accessToken = signAccessToken(user._id);
  const refreshToken = signRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
  });

  res.json({ accessToken });
});
```

---

## 🔁 `POST /api/auth/refresh`

```js
const { verifyRefreshToken, signAccessToken, signRefreshToken } = require('../utils/jwt');

router.post('/refresh', async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) return res.status(401).json({ error: 'Missing refresh token' });

  try {
    const { id } = verifyRefreshToken(token);
    const user = await User.findById(id).select('+refreshToken');

    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }

    const newAccessToken = signAccessToken(id);
    const newRefreshToken = signRefreshToken(id);

    user.refreshToken = newRefreshToken;
    await user.save();

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
});
```

---

## 🚪 `POST /api/auth/logout`

```js
router.post('/logout', async (req, res) => {
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

  res.sendStatus(204); // No Content
});
```

---

## 🔐 Middleware: `requireAuth.js`

```js
const { verifyAccessToken } = require('../utils/jwt');

module.exports = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer '))
    return res.status(401).json({ error: 'No token' });

  try {
    const token = header.split(' ')[1];
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ error: 'Token expired or invalid' });
  }
};
```

---

## ✅ Example Protected Route

```js
const requireAuth = require('../middleware/requireAuth');

router.get('/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ email: user.email, name: user.name });
});
```

---

## 🧪 Frontend Flow (React/fetch)

```js
// Login
await fetch('/api/auth/login', {
  method: 'POST',
  credentials: 'include',
  body: JSON.stringify({ email, password }),
  headers: { 'Content-Type': 'application/json' }
});

// Refresh access token
await fetch('/api/auth/refresh', {
  method: 'POST',
  credentials: 'include'
});

// Use access token
await fetch('/api/user/me', {
  headers: {
    Authorization: `Bearer ${accessToken}`
  }
});
```

---

## 🔒 Best Practices

| Practice                | Tip                                 |
| ----------------------- | ----------------------------------- |
| Use `httpOnly` cookies  | Prevent JS access to refresh tokens |
| Secure tokens in DB     | Store refresh tokens server-side    |
| Rotate tokens           | Regenerate refresh token on use     |
| Use `sameSite=Strict`   | Prevent CSRF                        |
| Use HTTPS in production | Avoid leaking tokens                |

---

Would you like:

* Auto-refresh token in React?
* Access + refresh token rotation strategy?
* 2FA or device-based login?

Let me know — I can build it with you.

Here's how to add a **Resend Verification Email** function in your Express + Mongoose backend.

---

## ✅ Goal

* If user hasn't verified their email, allow them to **request a new verification link**
* Prevent spam/resend abuse (optionally rate limit)

---

## 🛠 Prerequisites

Ensure your `User` model has a `verificationToken` field (already used for signup verification):

```js
verificationToken: String,
isVerified: {
  type: Boolean,
  default: false,
}
```

---

## 🔧 1. Utility to Generate & Send Verification Email

### 🔁 `utils/sendVerificationEmail.js`

```js
const { generateToken } = require('./jwt');
const sendEmail = require('./sendEmail');

const sendVerificationEmail = async (user) => {
  const token = generateToken({ email: user.email }, '10m');
  user.verificationToken = token;
  await user.save();

  const link = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  await sendEmail(
    user.email,
    'Verify Your Email',
    `<p>Hello ${user.name},<br>Please verify your email by clicking <a href="${link}">here</a>.</p>`
  );
};

module.exports = sendVerificationEmail;
```

---

## 🔁 2. `POST /auth/resend-verification` Route

```js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const sendVerificationEmail = require('../utils/sendVerificationEmail');

router.post('/resend-verification', async (req, res) => {
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
});
```

---

## 🧪 Sample Request

```http
POST /auth/resend-verification
Content-Type: application/json

{
  "email": "user@example.com"
}
```

---

## 🧠 Optional: Rate Limit Resends

Use `express-rate-limit` to block frequent requests:

```bash
npm install express-rate-limit
```

```js
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3, // 3 requests per 15 min
  message: 'Too many resend attempts. Please try again later.',
});

router.post('/resend-verification', limiter, ...);
```

---

## ✅ Summary

| Feature           | Done         |
| ----------------- | ------------ |
| Regenerate token  | ✅            |
| Store in DB       | ✅            |
| Send email again  | ✅            |
| Protect from spam | ✅ (optional) |

---

Would you like:

* To add frontend button for this?
* Rate limit by IP or user?
* Link expiry logic or block old tokens?

I can help extend it.

## Add more functions to delete an unverified account in 30 minnuts with node-cron

To **automatically delete unverified accounts after 30 minutes**, you can schedule a job using `node-cron` or (preferably) **Agenda** if you're already storing jobs in MongoDB (which you are).

Here’s how to implement both approaches. We'll focus on **Agenda**, since it's more dynamic and persistent than `node-cron`.

---

## ✅ Use Agenda to Delete Unverified Accounts

### 📁 Folder Structure Addition

```bash
/jobs
├── deleteUnverified.js
```

---

### 🛠 1. Define Deletion Job (`jobs/deleteUnverified.js`)

```js
// jobs/deleteUnverified.js
const agenda = require('../agenda');
const User = require('../models/User');

agenda.define('delete unverified user', async (job) => {
  const { email } = job.attrs.data;
  const user = await User.findOne({ email });

  if (user && !user.isVerified) {
    console.log(`🗑 Deleting unverified user: ${email}`);
    await User.deleteOne({ email });
  }
});
```

> ✅ This job deletes the user only **if they are still unverified**.

---

### ⚙️ 2. Schedule Job After Signup

In your `POST /signup` route, after sending the verification email:

```js
const agenda = require('../agenda'); // make sure agenda is started
require('../jobs/deleteUnverified'); // ensure job is loaded

await agenda.schedule('in 30 minutes', 'delete unverified user', {
  email: user.email,
});
```

---

### 🧪 Sample Flow

1. User signs up
2. Gets a verification email
3. If not verified within 30 minutes → job deletes them

---

## 📦 Optional: Use node-cron Instead (runs periodically)

> If you still prefer `node-cron` (static):

```bash
npm install node-cron
```

### 🕒 In your `app.js` or `cron.js`

```js
const cron = require('node-cron');
const User = require('./models/User');

// Runs every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
  const users = await User.deleteMany({
    isVerified: false,
    createdAt: { $lt: thirtyMinutesAgo },
  });

  if (users.deletedCount > 0) {
    console.log(`🗑 Deleted ${users.deletedCount} unverified users`);
  }
});
```

> ✅ Make sure `User` has `timestamps: true` enabled in the schema:

```js
const userSchema = new mongoose.Schema({ ... }, { timestamps: true });
```

---

## ✅  Summary

| Approach       | Pros                           | Usage                  |
| -------------- | ------------------------------ | ---------------------- |
| `Agenda`       | Persistent, DB-scheduled       | Best for this case     |
| `node-cron`    | Simple, memory-based           | Good for global sweeps |
| Job defined?   | ✅ `delete unverified user`     |                        |
| Job scheduled? | ✅ `in 30 minutes` after signup |                        |

---

Would you like:

* A frontend notice that the account expires in 30 minutes?
* Job cancellation if the user verifies early?
* A dashboard to manage these jobs?

Let me know and I can build that too.
