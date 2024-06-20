/**
 * Title: app.js
 * Author: Victor Soto
 * Date: 06/09/2024
 * Description: Server for the app
 */

"use strict";

// Require statements
const express = require("express");
const createServer = require("http-errors");
const path = require("path");

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express"); // Import swaggerUi
const employeeRoute = require("./routes/employee-route");

// Create the Express app
const app = express();

// Configure the app
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../dist/nodebucket")));
app.use("/", express.static(path.join(__dirname, "../dist/nodebucket")));
app.use("/api/employees", employeeRoute);

// Define swagger options.
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Nodebucket APIs",
      description: "API for finding employees by ID",
    },
  },
  apis: ["./server/routes/*.js"],
};

// Initialize Swagger
const swaggerSpecification = swaggerJsdoc(swaggerOptions);

// Serve Swagger documentation - Swagger UI middleware.
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecification));

app.use("/api/employees", employeeRoute); // Use the employee route.

// error handler for 404 errors
app.use(function (req, res, next) {
  next(createServer(404)); // forward to error handler
});

// error handler for all other errors
app.use(function (err, req, res, next) {
  res.status(err.status || 500); // set response status code

  // send response to client in JSON format with a message and stack trace
  res.json({
    type: "error",
    status: err.status,
    message: err.message,
    stack: req.app.get("env") === "development" ? err.stack : undefined,
  });
});

// Express.js listening on port 3001
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app; // export the Express application
