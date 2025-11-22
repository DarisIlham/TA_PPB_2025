// validate.calendar.js
import { body, validationResult } from 'express-validator';

export default [
  body('title')
    .notEmpty().withMessage('Judul kegiatan wajib diisi')
    .isString().withMessage('Judul harus berupa teks')
    .isLength({ max: 100 }).withMessage('Judul maksimal 100 karakter'),

  body('description')
    .optional()
    .isString().withMessage('Deskripsi harus berupa teks'),

  body('date')
    .notEmpty().withMessage('Tanggal wajib diisi')
    .isISO8601().withMessage('Format tanggal tidak valid (gunakan ISO8601 ex: YYYY-MM-DD)'),

  body('time')
    .notEmpty().withMessage('Waktu wajib diisi')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Format waktu harus HH:MM (24 jam)'),

  body('category')
    .notEmpty().withMessage('Kategori wajib diisi')
    .isString().withMessage('Kategori harus berupa teks'),

  // Middleware untuk hasil validasi
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
