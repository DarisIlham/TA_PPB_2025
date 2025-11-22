// validate.siswa.js
import { body, validationResult } from "express-validator";

const validateSiswa = [
  body("nama")
    .notEmpty()
    .withMessage("Nama is required")
    .isString()
    .withMessage("Nama must be a string"),

  body("kelas")
    .notEmpty()
    .withMessage("Kelas is required")
    .isString()
    .withMessage("Kelas must be a string"),

  body("nisn")
    .notEmpty()
    .withMessage("NISN is required")
    .isNumeric()
    .withMessage("NISN must be a number")
    .isLength({ min: 10, max: 10 })
    .withMessage("NISN must be 10 digits"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export default validateSiswa;