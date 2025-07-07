# set up Agenda in an Express server (with MongoDB), follow these steps

---

## ✅ 1. Install Dependencies

Run this in your terminal:

```bash
npm install agenda
```

Make sure you already have:

```bash
npm install express mongoose dotenv
```

---

## ✅ 2. Setup `Agenda` in a Separate File (e.g., `agenda.js`)

```js
// agenda.js
const Agenda = require("agenda");

const agenda = new Agenda({
  db: { address: process.env.MONGO_URI, collection: "agendaJobs" },
  processEvery: "30 seconds", // optional: how often to check for jobs
  useUnifiedTopology: true,
});

agenda.on("ready", () => {
  console.log("Agenda connected and ready!");
});

module.exports = agenda;
```

---

## ✅ 3. Define Jobs (in `jobs/*.js`)

Example: `jobs/emailJob.js`

```js
module.exports = (agenda) => {
  agenda.define("send email report", async (job) => {
    const { to, subject, body } = job.attrs.data;
    console.log(`Sending email to ${to}, subject: ${subject}`);
    // your email logic here (e.g. using nodemailer)
  });
};
```

---

## ✅ 4. Load and Start Jobs (e.g., `loadJobs.js`)

```js
// loadJobs.js
const emailJob = require("./jobs/emailJob");

const defineJobs = (agenda) => {
  emailJob(agenda);
};

module.exports = defineJobs;
```

---

## ✅ 5. Use Agenda in Express Server (`server.js`)

```js
// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

const agenda = require("./agenda");
const defineJobs = require("./loadJobs");

// MongoDB connection
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("MongoDB connected");

  // Define and start agenda
  defineJobs(agenda);

  agenda.start().then(() => {
    console.log("Agenda started");

    // Schedule a sample job
    agenda.schedule("in 1 minute", "send email report", {
      to: "user@example.com",
      subject: "Hello from Agenda",
      body: "Test email",
    });
  });
});

// Express route
app.get("/", (req, res) => {
  res.send("Agenda Express Server running");
});

// Start Express
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

## ✅ 6. Example `.env` File

```env
MONGO_URI=mongodb://localhost:27017/agendaDB
PORT=5000
```

---

## 🧠 Tips

* Use **`agenda.every('1 hour', 'job-name')`** for recurring jobs.
* You can manage job states using `.now()`, `.schedule()`, `.every()`, `.cancel()`, etc.
* To create a **dashboard**, consider [agenda-ui](https://github.com/agenda/agendash).

---

Let me know if you want:

* recurring jobs
* admin dashboard for Agenda
* agenda with authentication (e.g., user-based jobs)

To **automatically delete unverified users** after a certain time (e.g., 24 hours), you can use **Agenda** to schedule a job when a user registers and hasn't verified their email.

---

## ✅ Step-by-Step: Delete Unverified Users with Agenda

### 🔹 1. Add `isVerified` and `createdAt` in Mongoose User Schema

```js
// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: String,
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
```

---

### 🔹 2. Define the Job to Delete Unverified Users

```js
// jobs/deleteUnverifiedUser.js
const User = require("../models/User");

module.exports = (agenda) => {
  agenda.define("delete unverified user", async (job) => {
    const { userId } = job.attrs.data;

    const user = await User.findById(userId);
    if (user && !user.isVerified) {
      await User.findByIdAndDelete(userId);
      console.log(`Deleted unverified user: ${user.email}`);
    } else {
      console.log(`User is already verified or not found.`);
    }
  });
};
```

---

### 🔹 3. Register the Job in `loadJobs.js`

```js
const deleteUnverifiedUser = require("./jobs/deleteUnverifiedUser");

const defineJobs = (agenda) => {
  deleteUnverifiedUser(agenda);
};

module.exports = defineJobs;
```

---

### 🔹 4. Schedule the Job When User Registers

In your **user registration route**:

```js
// routes/auth.js (example)
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const agenda = require("../agenda");

// register new user
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const user = new User({ email, password });
  await user.save();

  // Schedule deletion in 24 hours
  await agenda.schedule("in 24 hours", "delete unverified user", {
    userId: user._id,
  });

  // TODO: send verification email here

  res.status(201).json({ message: "User registered. Please verify your email." });
});

module.exports = router;
```

---

## ✅ Summary

| Feature                    | Tech/Logic                                                  |
| -------------------------- | ----------------------------------------------------------- |
| Database                   | MongoDB (Mongoose)                                          |
| Scheduler                  | Agenda                                                      |
| Verification check         | In `agenda.define(...)`, check `isVerified`                 |
| Scheduled at register time | `.schedule('in 24 hours', 'delete unverified user', {...})` |

---

## 🧪 Optional Improvements

* Use `agenda.every("1 hour", "cleanup expired unverified users")` if you don’t want to schedule per-user jobs.
* Index `createdAt` field for faster DB performance.
* Use email + token for email verification and update `isVerified` upon confirmation.

---

Would you like me to also:

* Add **email verification logic**?
* Show how to **cancel the job if user verifies before 24h**?
* Add an **admin panel to track scheduled jobs**?

Let me know!

To **send a warning email before deleting unverified users**, you can use **Agenda with two scheduled jobs**:

---

## ✅ Goal

1. **User registers (unverified)**
2. **After 23 hours** → Send "account will be deleted soon" email
3. **After 24 hours** → If still unverified, delete the user

---

## ✅ Step-by-Step Implementation

---

### 🔹 1. User Schema

Ensure your Mongoose `User` model has `isVerified` and `createdAt`:

```js
// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: String,
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
```

---

### 🔹 2. Email Sender Utility

You can use Nodemailer:

```js
// utils/sendEmail.js
const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"No Reply" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });
};

module.exports = sendEmail;
```

---

### 🔹 3. Define Two Jobs

#### `jobs/warnUnverifiedUser.js`

```js
// jobs/warnUnverifiedUser.js
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

module.exports = (agenda) => {
  agenda.define("warn unverified user", async (job) => {
    const { userId } = job.attrs.data;

    const user = await User.findById(userId);
    if (user && !user.isVerified) {
      await sendEmail(
        user.email,
        "Your account will be deleted soon",
        "You haven't verified your email. Your account will be deleted in 1 hour."
      );
      console.log(`Sent warning email to ${user.email}`);
    }
  });
};
```

#### `jobs/deleteUnverifiedUser.js`

```js
// jobs/deleteUnverifiedUser.js
const User = require("../models/User");

module.exports = (agenda) => {
  agenda.define("delete unverified user", async (job) => {
    const { userId } = job.attrs.data;

    const user = await User.findById(userId);
    if (user && !user.isVerified) {
      await User.findByIdAndDelete(userId);
      console.log(`Deleted unverified user: ${user.email}`);
    }
  });
};
```

---

### 🔹 4. Register Jobs

```js
// loadJobs.js
const deleteUnverifiedUser = require("./jobs/deleteUnverifiedUser");
const warnUnverifiedUser = require("./jobs/warnUnverifiedUser");

const defineJobs = (agenda) => {
  warnUnverifiedUser(agenda);
  deleteUnverifiedUser(agenda);
};

module.exports = defineJobs;
```

---

### 🔹 5. Schedule Jobs on User Registration

```js
// routes/auth.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const agenda = require("../agenda");

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const user = new User({ email, password });
  await user.save();

  // Schedule warning email at 23 hours
  await agenda.schedule("in 23 hours", "warn unverified user", { userId: user._id });

  // Schedule deletion at 24 hours
  await agenda.schedule("in 24 hours", "delete unverified user", { userId: user._id });

  res.status(201).json({ message: "Registered. Please verify your email." });
});
```

---

### 🔹 6. `.env` Example

```env
MONGO_URI=mongodb://localhost:27017/agendaDB
PORT=5000
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=yourapppassword
```

---

## ✅ Result

| Time After Registration | Job                    | Action                                      |
| ----------------------- | ---------------------- | ------------------------------------------- |
| 0h                      | On register            | Schedule 2 jobs                             |
| 23h                     | `warn unverified user` | Send email warning                          |
| 24h                     | `delete unverified`    | Delete user if still `isVerified === false` |

---

## 🧠 Optional Add-Ons

* Cancel jobs if user verifies early → use `agenda.cancel(...)`
* Resend verification link with the warning email
* Use HTML email templates for better formatting

Would you like help with **canceling jobs when user verifies**, or **resending verification link in the warning email**?

To **cancel scheduled Agenda jobs** (like delete/warning emails) when a user **verifies early**, you can use `agenda.cancel()` and match jobs using a unique property — such as `userId`.

---

## ✅ Step-by-Step: Cancel Agenda Job When User Verifies

---

### 🔹 1. Schedule Jobs with `userId` in `data` (You’ve already done this)

```js
await agenda.schedule("in 23 hours", "warn unverified user", { userId: user._id });
await agenda.schedule("in 24 hours", "delete unverified user", { userId: user._id });
```

---

### 🔹 2. On Email Verification – Cancel Those Jobs

When the user clicks the verification link, and your backend marks them as verified, cancel the two jobs like this:

```js
// routes/auth.js (verify route)
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const agenda = require("../agenda");

router.get("/verify/:userId", async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.isVerified) return res.json({ message: "User already verified" });

  user.isVerified = true;
  await user.save();

  // Cancel all jobs for this user
  await agenda.cancel({ "data.userId": user._id });

  res.json({ message: "Email verified successfully. Jobs cancelled." });
});
```

---

## 🔍 How It Works

* `agenda.schedule(name, data)` stores `data` in job attributes.
* Later, `agenda.cancel({ "data.userId": user._id })` will match all jobs (e.g., `warn unverified user`, `delete unverified user`) with that `userId` and remove them from the job queue.

---

## ✅ Result-

| Action                       | Effect                                                              |
| ---------------------------- | ------------------------------------------------------------------- |
| User registers               | Jobs scheduled to warn and delete after 23h & 24h                   |
| User verifies within 24h     | `agenda.cancel({ "data.userId": ... })` removes both scheduled jobs |
| No email or deletion happens | Because Agenda no longer has jobs for that user                     |

---

## 🧠 Tips-

* You can optionally check `agenda.jobs(...)` before canceling, for debugging.
* If you want to cancel specific job types only:

```js
await agenda.cancel({ name: "delete unverified user", "data.userId": user._id });
```

---

Would you like me to help you:

* Add **email verification token** via email?
* Add **admin interface** to monitor/cancel jobs manually?

Let me know!
