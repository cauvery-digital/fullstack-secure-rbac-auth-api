# Secure Express Auth API

A full-featured authentication backend built with Express + MongoDB:

## 🔐 Features

- JWT login/logout with refresh tokens (httpOnly cookie)
- Email verification
- Password reset via email
- Role-based access control
- Agenda for scheduling (e.g. auto-delete unverified accounts)
- Rate limiting, Helmet, CORS, HPP, XSS protection
- Swagger API docs

## 🧪 Tech Stack

- Express
- MongoDB + Mongoose
- JWT
- Nodemailer
- Agenda
- express-validator
- Swagger UI

## 🛠 Setup

1. Clone the repo
2. Run: `npm install`
3. Rename `.env.example` → `.env`
4. Fill in credentials (MongoDB URI, Mail, JWT secrets)
5. Start dev server:

   ```bash
   node server.js
   ```

***What This Will Include***

✅ Express backend with:

- Authentication (JWT + Refresh Token via Cookie)
- Email Verification + Reset Password (Nodemailer)
- Role-based access (user, admin)
- Unverified account auto-deletion (Agenda + MongoDB)
- Rate-limiting, Helmet, XSS/CORS/HPP protection
- Validation via express-validator
- Swagger-powered API docs
- Deployment-ready setup with .env.example

✅ Step 1: Create Project Structure

```bash
secure-auth-api/
├── agenda/
│   └── index.js
├── controllers/
│   └── authController.js
├── docs/
│   └── swagger.js
├── jobs/
│   └── deleteUnverifiedUser.js
├── middleware/
│   ├── authMiddleware.js
│   ├── roleMiddleware.js
│   ├── validate.js
├── models/
│   └── User.js
├── routes/
│   ├── authRoutes.js
│   └── adminRoutes.js
├── utils/
│   ├── sendEmail.js
│   └── token.js
├── validators/
│   ├── authValidators.js
│   └── userValidators.js
├── .env.example
├── package.json
├── server.js
└── README.md
```

✅ Step 2: Add .env.example

```bash
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/dbname
JWT_ACCESS_SECRET=access_secret
JWT_REFRESH_SECRET=refresh_secret
JWT_RESET_SECRET=reset_secret
MAIL_USER=you@gmail.com
MAIL_PASS=your_app_password
DELETE_UNVERIFIED_AFTER_MIN=30
NODE_ENV=development
```

🧑‍💻 Dev Commands

```bash
npm run dev         # With nodemon
node server.js      # Production-style run
```
