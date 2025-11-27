import { body, validationResult } from "express-validator";

const validateCardio = [
  body("date").isISO8601().withMessage("Date must be a valid ISO date"),

  body("type").notEmpty().withMessage("Type is required"),

  body("distance")
    .isFloat({ gt: 0 })
    .withMessage("Distance must be a number greater than 0"),

  body("duration")
    .isFloat({ gt: 0 })
    .withMessage("Duration must be a number greater than 0"),

  body("pace")
    .optional()
    .isString(),

  body("calories")
    .optional(),
    

  body("location")
    .optional()
    .isString()
    .withMessage("Location must be a string"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export default validateCardio;
