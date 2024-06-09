/**
 * Title: employee-route.js
 * Author: Victor Soto
 * Date: 6/3/2024
 * Description: Employee routes, use database SwaggerUI/
 */

"use strict";

const express = require("express");
const { mongo } = require("../utils/mongo");
const createError = require("http-errors");

const router = express.Router();

// Base: http://localhost:300/api/employees/:empId
// valid: http://localhost"300/api/employees/1007

// Invalid: http://localhost"300/api/employees/foo
// Invalid: http://localhost"300/api/employees/9999

/**
 * @openapi
 * /api/employees/{empId}:
 *   get:
 *     tags:
 *       - Employees
 *     summary: Retrieve an employee by ID
 *     parameters:
 *       - in: path
 *         name: empId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The employee ID
 *     responses:
 *       200:
 *         description: A single employee object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 empId:
 *                   type: integer
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *       400:
 *         description: Bad request
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Internal server error
 */

router.get("/:empId", async (req, res, next) => {
  let { empId } = req.params;
  try {
    if (!empId) throw new Error("Employee ID is required");
    empId = parseInt(empId, 10);
    if (isNaN(empId)) {
      console.error("Input must be a number");
      return next(createError(400, "Input must be a number"));
    }

    await mongo(async (db) => {
      const employee = await db.collection("employees").findOne({ empId });
      if (!employee) {
        console.error("Employee not found:", empId);
        return next(createError(404, "Employee not found"));
      }
      res.send(employee);
    }, next);
  } catch (err) {
    console.error("Error:", err);
    next(err);
  }
});

module.exports = router;
