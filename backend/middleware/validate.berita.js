import { body, validationResult } from "express-validator";

export default [
  body('id_berita')
    .optional()
    .isInt().withMessage('ID Berita must be an integer'),

  body('judul')
    .trim()
    .notEmpty().withMessage('Judul is required')
    .isLength({ max: 200 }).withMessage('Judul cannot exceed 200 characters'),

  body('isi')
    .trim()
    .notEmpty().withMessage('Isi berita is required'),

  body('tanggal_publikasi')
    .notEmpty().withMessage('Tanggal publikasi is required')
    .isISO8601().withMessage('Invalid date format (use YYYY-MM-DD)')
    .toDate(),

  body('gambar_utama')
    .notEmpty().withMessage('Gambar utama is required')
    .isString().withMessage('Gambar utama must be a string'),

  body(['gambar1', 'gambar2', 'gambar3', 'gambar4', 'gambar5'])
    .optional()
    .isString().withMessage('Gambar must be a string'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];