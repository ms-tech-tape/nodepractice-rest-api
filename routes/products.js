/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Products management API
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of all products
 *
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *                 example: Wireless Keyboard
 *               price:
 *                 type: number
 *                 example: 1499
 *               category:
 *                 type: string
 *                 example: Electronics
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 *
 *   put:
 *     summary: Update product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *                 example: Wireless Keyboard
 *               price:
 *                 type: number
 *                 example: 1499
 *               category:
 *                 type: string
 *                 example: Electronics
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Product not found
 *
 *   delete:
 *     summary: Delete product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */

const express = require("express");
const router = express.Router();


const { validationResult } = require("express-validator");

const { readData, writeData } = require("../utils/dataManager");
const productValidationRules = require("../validators/productValidator");

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await readData("products.json");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error reading products" });
  }
});

// GET product by ID
router.get("/:id", async (req, res) => {
  try {
    const products = await readData("products.json");
    const id = Number(req.params.id);

    const product = products.find((p) => p.id === id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error reading products" });
  }
});

// POST create product with validation
router.post("/", productValidationRules, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  try {
    const products = await readData("products.json");

    const newProduct = {
      id: Date.now(),
      name: req.body.name.trim(),
      price: Number(req.body.price),
      category: req.body.category.trim(),
    };

    products.push(newProduct);

    await writeData("products.json", products);

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: "Error creating product" });
  }
});

// PUT update product with validation
router.put("/:id", productValidationRules, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  try {
    const products = await readData("products.json");
    const id = Number(req.params.id);

    const product = products.find((p) => p.id === id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    product.name = req.body.name.trim();
    product.price = Number(req.body.price);
    product.category = req.body.category.trim();

    await writeData("products.json", products);

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error updating product" });
  }
});

// DELETE product
router.delete("/:id", async (req, res) => {
  try {
    const products = await readData("products.json");
    const id = Number(req.params.id);

    const productExists = products.some((p) => p.id === id);

    if (!productExists) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const updatedProducts = products.filter((p) => p.id !== id);

    await writeData("products.json", updatedProducts);

    res.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product" });
  }
});

module.exports = router;
