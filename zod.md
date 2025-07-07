# Integrating **Zod** into an Express app

That helps validate and parse incoming request data easily and safely.

Here’s a **step-by-step guide** to integrating **Zod** for request body validation in your Express routes.

---

## ✅ 1. **Install Zod**

```bash
npm install zod
```

---

## ✅ 2. **Create a Zod Schema**

You can define schemas for request validation using Zod like this:

```js
// schemas/user.schema.js
const { z } = require("zod");

const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

module.exports = {
  createUserSchema,
};
```

---

## ✅ 3. **Create a Middleware for Validation**

```js
// middlewares/validate.js
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: result.error.flatten().fieldErrors,
    });
  }

  // attach parsed data to request
  req.body = result.data;
  next();
};

module.exports = validate;
```

---

## ✅ 4. **Use the Middleware in Your Routes**

```js
// routes/user.routes.js
const express = require("express");
const { createUserSchema } = require("../schemas/user.schema");
const validate = require("../middlewares/validate");

const router = express.Router();

router.post("/register", validate(createUserSchema), (req, res) => {
  // Now req.body is validated and parsed
  const { name, email, password } = req.body;
  // Proceed with saving user to DB
  res.status(201).json({ message: "User registered successfully" });
});

module.exports = router;
```

---

## ✅ 5. **Setup in Main Server File**

```js
// app.js or server.js
const express = require("express");
const userRoutes = require("./routes/user.routes");

const app = express();
app.use(express.json()); // for parsing JSON body

app.use("/api/users", userRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
```

---

## ✅ Bonus: Validate Query, Params, etc

You can extend the middleware to validate `req.query`, `req.params`, etc.

---

Let me know if you want me to show how to:

* Validate `req.query` or `req.params`
* Use it with TypeScript
* Structure this in a modular pattern for larger apps

Would you like that?
