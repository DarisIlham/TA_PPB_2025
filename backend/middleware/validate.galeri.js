import { body, validationResult } from "express-validator";

export default [
  body('id_galeri')
    .optional()
    .isInt().withMessage('ID Galeri must be an integer'),

  body('gambar')
    .notEmpty().withMessage('At least one image is required')
    .isString().withMessage('Image path must be a string'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];