import { body } from 'express-validator';

import { MedicType } from '../models/medic';
import {
  CLINIC_CLOSING_TIME,
  CLINIC_OPENING_TIME
} from '../custom-types-consts';

export const validateImage = body('image')
  .notEmpty()
  .withMessage('Please attach a picture.');

export const validateMedicType = body('type')
  .toLowerCase()
  .trim()
  .isIn(Object.values(MedicType));

export const validateShift = [
  body('shiftStart').isInt({
    min: CLINIC_OPENING_TIME,
    max: CLINIC_CLOSING_TIME
  }),
  body('shiftEnd')
    .isInt({ max: CLINIC_CLOSING_TIME })
    .custom((_, { req }) => {
      const { shiftStart, shiftEnd } = req.body;
      return shiftEnd >= shiftStart;
    })
];

export const medicReqBody = [
  validateImage,
  validateMedicType,
  ...validateShift
];
