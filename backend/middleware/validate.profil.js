import { body, validationResult } from "express-validator";

const validateProfil = [
  body("deskripsi")
    .notEmpty()
    .withMessage("Deskripsi is required")
    .isString()
    .withMessage("Deskripsi must be a string"),

  body("gambar")
    .trim()
    .isURL()
    .withMessage("Logo must be a valid URL")
    .optional(),

  body("visi")
    .notEmpty()
    .withMessage("Visi is required")
    .isString()
    .withMessage("Visi must be a string"),

  body("misi")
    .isArray({ min: 1 })
    .withMessage("Misi must be an array with at least one item")
    .custom((arr) => arr.every((item) => typeof item === "string"))
    .withMessage("Each misi item must be a string"),

  body("tujuan")
    .isArray({ min: 1 })
    .withMessage("Tujuan must be an array with at least one item")
    .custom((arr) => arr.every((item) => typeof item === "string"))
    .withMessage("Each tujuan item must be a string"),

  body("strategi")
    .notEmpty()
    .withMessage("Strategi is required")
    .isString()
    .withMessage("Strategi must be a string"),

  body("map")
    .notEmpty()
    .withMessage("Map is required")
    .isString()
    .withMessage("Map must be a string"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export default validateProfil;
