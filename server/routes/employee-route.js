/**
 * Title: employee-route.js
 * Author: Professor Krasso
 * Updated by: Victor Soto
 * Date: 6/3/2024
 * Description: Employee routes, use database SwaggerUI/
 */
"use strict"; // This line enables strict mode in JavaScript, which helps catch common coding mistakes and unsafe actions.

// Require statements
const express = require("express"); // This line imports the Express.js library, which is used to build web servers.
const router = express.Router(); // This line creates a new router object that can handle different routes for your web server.
const createError = require("http-errors"); // This line imports a library that helps create HTTP error objects.
const { mongo } = require("../utils/mongo"); // This line imports a utility for working with MongoDB.

const Ajv = require("ajv"); // This line imports the Ajv library, which is used to validate JSON data.
const { ObjectId } = require("mongodb"); // This line imports a specific function from the MongoDB library that generates unique identifiers for database entries.

const ajv = new Ajv(); // This line creates a new instance of the Ajv object.

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

router.get("/:empId", (req, res, next) => {
  try {
    let { empId } = req.params;
    empId = parseInt(empId, 10);

    // Check if empId is a number
    if (isNaN(empId)) {
      console.error("Input must be a number");
      return next(createError(400, "Input must be a number"));
    }

    // Fetch employee by ID
    mongo(async (db) => {
      const employee = await db
        .collection("employees")
        .findOne(
          { empId: empId },
          { projection: { empId: 1, todo: 1, done: 1 } }
        );

      // If employee not found, return error
      if (!employee) {
        console.error("Employee not found:", empId);
        return next(createError(404, "Employee not found"));
      }

      // Send employee data in response
      res.send(employee);
    }, next);
  } catch (err) {
    console.error("Error:", err);
    next(err);
  }
});

/**
 * findAllTasks API
 * @returns JSON array of all tasks
 * @throws { 500 error) - if there is a server error
 * @throws { 400 error } - if the employee id is not a number
 * @throws { 404 error } - if no tasks are found
 */

/**
 * @openapi
 * /api/employees/{empId}/tasks:
 *   get:
 *     tags:
 *       - Employees
 *     summary: Retrieve tasks of an employee by ID
 *     parameters:
 *       - in: path
 *         name: empId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The employee ID
 *     responses:
 *       200:
 *         description: A single employee's tasks object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 empId:
 *                   type: integer
 *                 todo:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       text:
 *                         type: string
 *                 done:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       text:
 *                         type: string
 *       400:
 *         description: Bad request
 *       404:
 *         description: Tasks not found for the employee ID
 *       500:
 *         description: Internal server error
 */

router.get("/:empId/tasks", (req, res, next) => {
  try {
    let { empId } = req.params;
    empId = parseInt(empId, 10);

    // Check to determine if the returned value from parseInt is NaN
    if (isNaN(empId)) {
      console.error("Input must be a number");
      return next(createError(400, "Input must be a number"));
    }

    // Call our mongo module and return a list of tasks by employee ID
    mongo(async (db) => {
      const tasks = await db
        .collection("employees")
        .findOne(
          { empId: empId },
          { projection: { empId: 1, todo: 1, done: 1 } }
        );

      // If there are no tasks found for the employee ID
      if (!tasks) {
        console.error(`Tasks not found for employee ID ${empId}`);
        return next(
          createError(404, `Tasks not found for employee ID ${empId}`)
        );
      }

      // Return the tasks object
      res.send(tasks);
    }, next);
  } catch (err) {
    console.error("Error:", err);
    next(err);
  }
});

// Task schema for validation
const taskSchema = {
  type: "object",
  properties: {
    text: { type: "string" },
  },
  required: ["text"],
  additionalProperties: false,
};

/**
 * @openapi
 * /api/employees/{empId}/tasks:
 *   post:
 *     tags:
 *       - Employees
 *     summary: Create a new task for an employee by ID
 *     parameters:
 *       - in: path
 *         name: empId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The employee ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *     responses:
 *       201:
 *         description: A new task was created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *       400:
 *         description: Bad request
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Internal server error
 */

router.post("/:empId/tasks", (req, res, next) => {
  try {
    let { empId } = req.params;
    empId = parseInt(empId, 10);

    // Check if empId is a number
    if (isNaN(empId)) {
      console.error("Input must be a number");
      return next(createError(400, "Input must be a number"));
    }

    // Insert a new task
    mongo(async (db) => {
      const employee = await db.collection("employees").findOne({ empId });

      // If employee not found or todo array doesn't exist, add it
      if (!employee || !employee.todo) {
        await db
          .collection("employees")
          .updateOne({ empId: empId }, { $set: { todo: [] } });
      }

      // Validate task payload
      const validator = ajv.compile(taskSchema);
      const valid = validator(req.body);

      // If payload is invalid, return error
      if (!valid) {
        console.error("Invalid task payload", validator.errors);
        return next(createError(400, "Invalid task payload", validator.errors));
      }

      // Create new task
      const newTask = {
        _id: new ObjectId(),
        text: req.body.text,
      };

      // Add new task to employee's todo list
      const result = await db
        .collection("employees")
        .updateOne({ empId: empId }, { $push: { todo: newTask } });

      // If task not added, return error
      if (!result.modifiedCount) {
        console.error("Unable to create task");
        return next(createError(400, "Unable to create task"));
      }

      // Send new task ID in response
      res.status(201).send({ id: newTask._id });
    }, next);
  } catch (err) {
    console.error("Error:", err);
    next(err);
  }
}); // This is a 'rule book' for tasks. It says a task should be an object with 'todo' and 'done' parts.
// Both 'todo' and 'done' are lists of tasks. Each task is an object with an 'id' and 'text'.
const tasksSchema = {
  // ... code omitted for brevity ...
};

/**
 * @openapi
 * /api/employees/tasks/{empId}:
 *   put:
 *     tags:
 *       - Employees
 *     summary: Update tasks of an employee by ID
 *     parameters:
 *       - in: path
 *         name: empId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The employee ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               todo:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     text:
 *                       type: string
 *               done:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     text:
 *                       type: string
 *     responses:
 *       204:
 *         description: No Content
 *       400:
 *         description: Bad request
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Internal server error
 */

// This code listens for requests to change a task for a specific employee.
router.put("/tasks/:empId", (req, res, next) => {
  try {
    // It first gets the employee's ID from the request.
    let { empId } = req.params;
    empId = parseInt(empId, 10);

    // If the employee ID isn't a number, it stops and says "Employee ID must be a number".
    if (isNaN(empId)) {
      return next(createError(400, "Employee ID must be a number"));
    }

    // It then tries to find the employee in the database.
    mongo(async (db) => {
      const employee = await db
        .collection("employees")
        .findOne({ empId: empId });

      // to see if the query to mongodb is returning the employee object.
      console.log("employee", employee);

      if (!employee) {
        console.log("Employee not found validation code");
        return next(createError(404, `Employee not found with empId ${empId}`));
      }

      // It gets the tasks from the request.
      const tasks = req.body;

      // It checks if the tasks follow the rule book.
      const validator = ajv.compile(tasksSchema);
      const valid = validator(tasks);

      // If the tasks don't follow the rule book, it stops and says "Invalid task payload".
      if (!valid) {
        return next(createError(400, "Invalid task payload", validator.errors));
      }

      // It then updates the employee's tasks in the database.
      const result = await db
        .collection("employees")
        .updateOne(
          { empId: empId },
          { $set: { todo: tasks.todo, done: tasks.done } }
        );

      // Set the response status to 204 (No Content)
      res.status(204).send();
    }, next);
  } catch (err) {
    // If something goes wrong, it logs the error.
    console.error("err", err);
    next(err);
  }
});

/**
 * @openapi
 * /api/employees/{empId}/tasks/{taskId}:
 *   delete:
 *     tags:
 *       - Employees
 *     summary: Delete a specific task of an employee by ID
 *     parameters:
 *       - in: path
 *         name: empId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The employee ID
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: The task ID
 *     responses:
 *       204:
 *         description: No Content
 *       400:
 *         description: Bad request
 *       404:
 *         description: Employee or task not found
 *       500:
 *         description: Internal server error
 */

// This part of the code listens for requests to remove a task for a specific employee.
router.delete("/:empId/tasks/:taskId", (req, res, next) => {
  try {
    // It first gets the employee's ID and the task's ID from the request.
    let { empId } = req.params;
    let { taskId } = req.params;

    // It makes sure the employee's ID is a number.
    empId = parseInt(empId, 10);
    if (isNaN(empId)) {
      // If it's not a number, it stops and says "Employee ID must be a number".
      return next(createError(400, "Employee ID must be a number"));
    }

    // It then tries to find the employee in the database.
    mongo(async (db) => {
      const employee = await db
        .collection("employees")
        .findOne({ empId: empId });

      // If it can't find the employee, it stops and says "Employee not found with empId".
      if (!employee) {
        return next(createError(404, `Employee not found with empId ${empId}`));
      }

      // It makes sure the employee has a 'todo' list and a 'done' list.
      if (!employee.todo) employee.todo = [];
      if (!employee.done) employee.done = [];

      // It removes the task from the 'todo' list and the 'done' list.
      const todo = employee.todo.filter(
        (t) => t._id.toString() !== taskId.toString()
      );
      const done = employee.done.filter(
        (t) => t._id.toString() !== taskId.toString()
      );

      // It then updates the employee's tasks in the database.
      const result = await db
        .collection("employees")
        .updateOne({ empId: empId }, { $set: { todo: todo, done: done } });

      // Set the response status to 204 (No Content)
      res.status(204).send();
    }, next);
  } catch (err) {
    // If something goes wrong, it logs the error.
    console.error("err", err);
    next(err);
  }
});
// This makes the code available (exports) to other parts of the application.
module.exports = router; // end module.exports = router
