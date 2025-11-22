import { body, validationResult } from "express-validator";

export default [
  // Header Section Validation
  body('header')
    .trim()
    .optional()
    .isLength({ max: 100 }).withMessage('Header cannot exceed 100 characters'),

  // Main Content Validation
  body('judul')
    .trim()
    .optional()
    .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),

  body('subjudul')
    .trim()
    .optional()
    .isLength({ max: 200 }).withMessage('Subtitle cannot exceed 200 characters'),

  body('deskripsi')
    .trim()
    .optional()
    .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),

  body('gambar')
    .trim()
    .optional()
    .isURL().withMessage('Must be a valid URL')
    .matches(/\.(jpg|jpeg|png|gif|webp)$/i).withMessage('URL must point to an image file'),

  // Stats Validation - Separated for each field
  body('namajumlah1')
    .trim()
    .optional()
    .isLength({ max: 50 }).withMessage('Stat name 1 cannot exceed 50 characters'),
  
  body('jumlah1')
    .optional()
    .isInt({ min: 0 }).withMessage('Stat value 1 must be a positive integer'),

  body('namajumlah2')
    .trim()
    .optional()
    .isLength({ max: 50 }).withMessage('Stat name 2 cannot exceed 50 characters'),
  
  body('jumlah2')
    .optional()
    .isInt({ min: 0 }).withMessage('Stat value 2 must be a positive integer'),

  body('namajumlah3')
    .trim()
    .optional()
    .isLength({ max: 50 }).withMessage('Stat name 3 cannot exceed 50 characters'),
  
  body('jumlah3')
    .optional()
    .isInt({ min: 0 }).withMessage('Stat value 3 must be a positive integer'),

  // Feature Section Title Validation
  body('judulfeature')
    .trim()
    .optional()
    .isLength({ max: 100 }).withMessage('Feature section title cannot exceed 100 characters'),

  // Features Validation - Separated for each field
  body('feature1')
    .trim()
    .optional()
    .isLength({ max: 100 }).withMessage('Feature 1 title cannot exceed 100 characters'),
  
  body('deskripsifeature1')
    .trim()
    .optional()
    .isLength({ max: 300 }).withMessage('Feature 1 description cannot exceed 300 characters'),

  body('feature2')
    .trim()
    .optional()
    .isLength({ max: 100 }).withMessage('Feature 2 title cannot exceed 100 characters'),
  
  body('deskripsifeature2')
    .trim()
    .optional()
    .isLength({ max: 300 }).withMessage('Feature 2 description cannot exceed 300 characters'),

  body('feature3')
    .trim()
    .optional()
    .isLength({ max: 100 }).withMessage('Feature 3 title cannot exceed 100 characters'),
  
  body('deskripsifeature3')
    .trim()
    .optional()
    .isLength({ max: 300 }).withMessage('Feature 3 description cannot exceed 300 characters'),

  body('feature4')
    .trim()
    .optional()
    .isLength({ max: 100 }).withMessage('Feature 4 title cannot exceed 100 characters'),
  
  body('deskripsifeature4')
    .trim()
    .optional()
    .isLength({ max: 300 }).withMessage('Feature 4 description cannot exceed 300 characters'),

  // Error handling middleware
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];