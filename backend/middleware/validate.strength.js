import { body, validationResult } from "express-validator";

const validateStrength = [
  body("date")
    .isISO8601()
    .withMessage("Date must be a valid ISO date"),

  body("name")
    .notEmpty()
    .withMessage("Workout name is required"),

  body("exercises")
    .isArray({ min: 1 })
    .withMessage("Exercises must be an array with at least one exercise"),

  body("exercises.*.name")
    .notEmpty()
    .withMessage("Exercise name is required"),

  body("exercises.*.sets")
    .isArray({ min: 1 })
    .withMessage("Each exercise must have at least one set"),

  body("exercises.*.sets.*.weight")
    .isFloat({ min: 0 })
    .withMessage("Weight must be a number greater than or equal to 0"),

  body("exercises.*.sets.*.reps")
    .isInt({ min: 1 })
    .withMessage("Reps must be an integer greater than 0"),

  body("duration")
    .isInt({ min: 1 })
    .withMessage("Duration must be an integer greater than 0"),

  body("rpe")
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage("RPE must be an integer between 1 and 10"),

  body("notes")
    .optional()
    .isString()
    .withMessage("Notes must be a string"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export default validateStrength;