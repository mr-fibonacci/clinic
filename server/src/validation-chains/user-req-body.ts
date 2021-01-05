import { body } from 'express-validator';

export const validateEmail = body('email')
  .isEmail()
  .normalizeEmail()
  .withMessage('Please provide a valid email, e.g. johndoe@gmail.com.');

export const validatePassword = body('password')
  .isLength({ min: 4, max: 20 })
  .withMessage('Please provide a password that is between 4 to 20 characters.');

export const userReqBody = [validateEmail, validatePassword];
