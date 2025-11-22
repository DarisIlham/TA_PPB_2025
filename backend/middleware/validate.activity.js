import { body, validationResult } from "express-validator";

export const validateActivity = [
  body("title")
    .notEmpty().withMessage("Title is required")
    .isString().withMessage("Title must be a string")
    .trim()
    .isLength({ min: 3, max: 100 }).withMessage("Title must be 3-100 characters"),

  body("description")
    .optional()
    .isString().withMessage("Description must be a string")
    .trim()
    .isLength({ max: 500 }).withMessage("Description cannot exceed 500 characters"),

  body("date")
    .notEmpty().withMessage("Date is required")
    .isISO8601().withMessage("Date must be a valid ISO8601 date"),

  body("status")
    .notEmpty().withMessage("Status is required")
    .isString().withMessage("Status must be a string")
    .isIn(["pending", "in-progress", "completed"]).withMessage("Invalid status"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];