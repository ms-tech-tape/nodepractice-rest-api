
const express = require("express");
const app = express();
const PORT = 3000;

// Import routes
const usersRouter = require("./routes/users");
const productsRouter = require("./routes/products");

// Import centralized error handler
const errorHandler = require("./middleware/errorHandler");

// Import Swagger
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

// Middleware to read JSON
app.use(express.json());

// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Connect API routes
app.use("/api/users", usersRouter);
app.use("/api/products", productsRouter);

// Home route
app.get("/", (req, res) => {
  res.send("Backend API is running!");
});

// Handle undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Centralized error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
