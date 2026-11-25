
const { body } = require("express-validator");

const userValidationRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email"),

  body("age")
    .notEmpty()
    .withMessage("Age is required")
    .isInt({ min: 1, max: 120 })
    .withMessage("Age must be between 1 and 120"),
];

module.exports = userValidationRules;
