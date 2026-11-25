
const express = require("express");
const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Users management API
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of all users
 *       500:
 *         description: Error reading users
 *
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - age
 *             properties:
 *               name:
 *                 type: string
 *                 example: Mishree
 *               email:
 *                 type: string
 *                 example: mishree@example.com
 *               age:
 *                 type: number
 *                 example: 20
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Error creating user
 */

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 *       500:
 *         description: Error reading users
 *
 *   put:
 *     summary: Update user by ID
 *     tags: [Users]
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
 *               - email
 *               - age
 *             properties:
 *               name:
 *                 type: string
 *                 example: Mishree
 *               email:
 *                 type: string
 *                 example: mishree@example.com
 *               age:
 *                 type: number
 *                 example: 20
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: User not found
 *       500:
 *         description: Error updating user
 *
 *   delete:
 *     summary: Delete user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Error deleting user
 */

const { validationResult } = require("express-validator");

const { readData, writeData } = require("../utils/dataManager");
const userValidationRules = require("../validators/userValidator");

// GET all users
router.get("/", async (req, res) => {
  try {
    const users = await readData("users.json");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error reading users" });
  }
});

// GET user by ID
router.get("/:id", async (req, res) => {
  try {
    const users = await readData("users.json");
    const id = Number(req.params.id);

    const user = users.find((u) => u.id === id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error reading users" });
  }
});

// POST create user with validation
router.post("/", userValidationRules, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  try {
    const users = await readData("users.json");

    const newUser = {
      id: Date.now(),
      name: req.body.name,
      email: req.body.email,
      age: req.body.age,
    };

    users.push(newUser);

    await writeData("users.json", users);

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
});

// PUT update user with validation
router.put("/:id", userValidationRules, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  try {
    const users = await readData("users.json");
    const id = Number(req.params.id);

    const user = users.find((u) => u.id === id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.name = req.body.name;
    user.email = req.body.email;
    user.age = req.body.age;

    await writeData("users.json", users);

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error updating user" });
  }
});

// DELETE user
router.delete("/:id", async (req, res) => {
  try {
    const users = await readData("users.json");
    const id = Number(req.params.id);

    const userExists = users.some((u) => u.id === id);

    if (!userExists) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const updatedUsers = users.filter((u) => u.id !== id);

    await writeData("users.json", updatedUsers);

    res.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
});

module.exports = router;
