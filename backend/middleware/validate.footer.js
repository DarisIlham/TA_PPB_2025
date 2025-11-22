import { body, validationResult } from "express-validator";

export default [
  // Logo Validation
  body('logo')
    .trim()
    .isURL().withMessage('Logo must be a valid URL')
    .optional(),

  // School Name Validation
  body('nama_sekolah')
    .trim()
    .isLength({ max: 100 }).withMessage('School name cannot exceed 100 characters')
    .optional(),

  // Address Validation
  body('alamat')
    .trim()
    .isLength({ max: 200 }).withMessage('Address cannot exceed 200 characters')
    .optional(),

  // Phone Number Validation
  body('no_telepon')
    .isInt({ min: 0 }).withMessage('Phone number must be a positive integer')
    .optional(),

  // Email Validation
  body('email')
    .trim()
    .isEmail().withMessage('Invalid email format')
    .optional(),

  // Social Media Validations
  body('facebook')
    .trim()
    .isURL().withMessage('Facebook must be a valid URL')
    .optional(),

  body('youtube')
    .trim()
    .isURL().withMessage('YouTube must be a valid URL')
    .optional(),

  body('instagram')
    .trim()
    .isURL().withMessage('Instagram must be a valid URL')
    .optional(),

  // Error handling middleware
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];