import { body, validationResult } from "express-validator";

export default [
  body('nama')
    .trim()
    .notEmpty().withMessage('Nama wajib diisi')
    .isLength({ max: 100 }).withMessage('Nama tidak boleh lebih dari 100 karakter'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email wajib diisi')
    .isEmail().withMessage('Email tidak valid')
    .normalizeEmail(),

  body('no_telepon')
    .trim()
    .notEmpty().withMessage('Nomor telepon wajib diisi')
    .matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/)
    .withMessage('Nomor telepon tidak valid'),

  body('isi')
    .trim()
    .notEmpty().withMessage('Isi feedback wajib diisi')
    .isLength({ min: 10 }).withMessage('Isi feedback minimal 10 karakter')
    .isLength({ max: 1000 }).withMessage('Isi feedback maksimal 1000 karakter'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];