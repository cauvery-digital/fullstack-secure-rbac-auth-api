const { ZodError } = require("zod");

const zodErrorHandler = (err, req, res, next) => {
  if (err instanceof ZodError) {
    const formatted = err.errors.map((e) => ({
      path: e.path.join("."),
      message: e.message,
    }));
    return res.status(400).json({ success: false, errors: formatted });
  }

  next(err);
};

module.exports = zodErrorHandler;