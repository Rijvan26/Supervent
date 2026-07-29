const { body, validationResult } = require('express-validator');

exports.validateInventory = [
  body('partNumber').notEmpty().withMessage('Part number is required').trim(),
  body('name').notEmpty().withMessage('Name is required').trim(),
  body('costPrice').isNumeric().withMessage('Cost price must be a number').isFloat({ min: 0 }).withMessage('Cost price cannot be negative'),
  body('sellingPrice').isNumeric().withMessage('Selling price must be a number').isFloat({ min: 0 }).withMessage('Selling price cannot be negative'),
  body('quantity').optional().isInt({ min: 0 }).withMessage('Quantity must be a positive integer'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];
