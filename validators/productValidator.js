
const { body } = require("express-validator");

const productValidationRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required"),

  body("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isFloat({ min: 0.01 })
    .withMessage("Price must be greater than zero"),

  body("category")
    .trim()
    .notEmpty()
    .withMessage("Product category is required"),
];

module.exports = productValidationRules;
