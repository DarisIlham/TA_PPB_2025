// validate.guru.js
import { body, validationResult } from "express-validator";

const validateGuru = [
  body("nama")
    .notEmpty()
    .withMessage("Nama is required")
    .isString()
    .withMessage("Nama must be a string"),

  body("nip")
    .notEmpty()
    .withMessage("NIP is required")
    .isNumeric()
    .withMessage("NIP must be a number"),

  body("pelajaran")
    .notEmpty()
    .withMessage("Pelajaran is required")
    .isString()
    .withMessage("Pelajaran must be a string"),

  body("gambar")
    .notEmpty()
    .withMessage("Gambar is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];



export default validateGuru;