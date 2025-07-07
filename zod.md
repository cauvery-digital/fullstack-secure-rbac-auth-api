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

To **validate `req.query` or `req.params` using Zod** in an Express app, you can slightly extend your middleware to support all parts of the request: `body`, `query`, and `params`.

---

## ✅ Step-by-Step Guide to Validate `req.query` / `req.params`

---

### ✅ 1. **Update Middleware to Accept Optional Schemas**

```js
// middlewares/validate.js
const validate = ({ body, query, params }) => (req, res, next) => {
  try {
    if (body) {
      const result = body.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: result.error.flatten().fieldErrors });
      }
      req.body = result.data;
    }

    if (query) {
      const result = query.safeParse(req.query);
      if (!result.success) {
        return res.status(400).json({ error: result.error.flatten().fieldErrors });
      }
      req.query = result.data;
    }

    if (params) {
      const result = params.safeParse(req.params);
      if (!result.success) {
        return res.status(400).json({ error: result.error.flatten().fieldErrors });
      }
      req.params = result.data;
    }

    next();
  } catch (err) {
    return res.status(500).json({ error: "Validation error", details: err.message });
  }
};

module.exports = validate;
```

---

### ✅ 2. **Define Schemas for `query` or `params`**

```js
// schemas/user.schema.js
const { z } = require("zod");

const getUserByIdParamsSchema = z.object({
  id: z.string().uuid("Invalid user ID format"), // assume UUID
});

const userQuerySchema = z.object({
  search: z.string().optional(),
  page: z.string().regex(/^\d+$/, "Page must be a number").optional(),
});

module.exports = {
  getUserByIdParamsSchema,
  userQuerySchema,
};
```

---

### ✅ 3. **Use in Route**

```js
// routes/user.routes.js
const express = require("express");
const { getUserByIdParamsSchema, userQuerySchema } = require("../schemas/user.schema");
const validate = require("../middlewares/validate");

const router = express.Router();

// Validate route params
router.get(
  "/:id",
  validate({ params: getUserByIdParamsSchema }),
  (req, res) => {
    const userId = req.params.id;
    res.json({ message: `User ID: ${userId}` });
  }
);

// Validate query params
router.get(
  "/search",
  validate({ query: userQuerySchema }),
  (req, res) => {
    const { search, page } = req.query;
    res.json({ search, page });
  }
);

module.exports = router;
```

---

## 🧠 Summary

* ✅ `req.body` — validate with `validate({ body: schema })`
* ✅ `req.query` — validate with `validate({ query: schema })`
* ✅ `req.params` — validate with `validate({ params: schema })`

You can combine them like:

```js
validate({
  body: bodySchema,
  query: querySchema,
  params: paramsSchema,
})
```

---

Let me know if you'd like this middleware written in **TypeScript**, or **structured into a reusable validator factory** for a clean, DRY setup.
