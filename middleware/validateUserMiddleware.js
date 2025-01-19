import { check, validationResult } from "express-validator";

export const validateUserInput = [
  check("username")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters."),
  check("email")
    .isEmail()
    .withMessage("Invalid email format."),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters.")
    .matches(/\d/)
    .withMessage("Password must contain at least one number.")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter.")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter."),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
