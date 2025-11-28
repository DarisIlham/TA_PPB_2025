import { body, validationResult } from "express-validator";

const validateGoal = [
  body("name")
    .notEmpty()
    .withMessage("Goal name is required")
    .isLength({ max: 100 })
    .withMessage("Goal name must be less than 100 characters"),

  body("metric")
    .notEmpty()
    .withMessage("Metric is required")
    .isIn(['Strength', 'Cardio', 'Endurance', 'Weight Loss', 'Muscle Gain', 'Flexibility', 'Other'])
    .withMessage("Invalid metric"),
  body("type")
    .optional()
    .isIn(['ascending', 'descending'])
    .withMessage("Type must be ascending or descending"),

  // VALIDASI BARU
  body("startValue")
    .optional() // Optional karena mungkin user lama tidak punya ini, tapi disarankan diisi
    .isFloat({ min: 0 })
    .withMessage("Start value must be a number greater than or equal to 0"),
    
  body("target")
    .isFloat({ min: 0 })
    .withMessage("Target must be a number greater than or equal to 0"),

  body("current")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Current value must be a number greater than or equal to 0"),

  body("deadline")
    .isISO8601()
    .withMessage("Deadline must be a valid ISO date")
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error("Deadline must be in the future");
      }
      return true;
    }),

  body("priority")
    .isIn(['Low', 'Medium', 'High'])
    .withMessage("Priority must be Low, Medium, or High"),

  body("status")
    .optional()
    .isIn(['active', 'completed', 'failed', 'paused'])
    .withMessage("Invalid status"),

  body("description")
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage("Description must be less than 500 characters"),

  body("history")
    .optional()
    .isArray()
    .withMessage("History must be an array"),

  body("history.*.date")
    .optional()
    .isISO8601()
    .withMessage("History date must be a valid ISO date"),

  body("history.*.value")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("History value must be a number greater than or equal to 0"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateWeeklySchedule = [
  body("schedules")
    .isArray({ min: 1, max: 7 })
    .withMessage("Schedules must be an array with 1-7 items"),

  body("schedules.*.day")
    .isIn(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])
    .withMessage("Day must be a valid day of week"),

  body("schedules.*.type")
    .isIn(['Workout', 'Rest', 'Cardio', 'Strength', 'Recovery'])
    .withMessage("Invalid schedule type"),

  body("schedules.*.details")
    .notEmpty()
    .withMessage("Schedule details are required")
    .isLength({ max: 200 })
    .withMessage("Details must be less than 200 characters"),

  body("weekStartDate")
    .isISO8601()
    .withMessage("Week start date must be a valid ISO date"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateGoalProgress = [
  body("value")
    .isFloat({ min: 0 })
    .withMessage("Value must be a number greater than or equal to 0"),

  body("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid ISO date"),

  body("notes")
    .optional()
    .isString()
    .isLength({ max: 200 })
    .withMessage("Notes must be less than 200 characters"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export default {
  validateGoal,
  validateWeeklySchedule,
  validateGoalProgress
};