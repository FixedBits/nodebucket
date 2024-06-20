/**
 * Title: mongo.js
 * Author: Victor Soto
 * Date: 06/09/2024
 * Description: Connection to MongoDB
 */

"use strict"; // Enforces strict mode to catch common JavaScript problems

// Importing MongoClient from the mongodb module
const { MongoClient } = require("mongodb");

// MongoDB connection string
const MONGO_URL =
  "mongodb+srv://nodebucket_user:1234@bellevueuniversity.heixdsl.mongodb.net/?retryWrites=true&w=majority&appName=BellevueUniversity";

// The 'mongo' function is an async function that takes two parameters: 'operations' and 'next'
const mongo = async (operations, next) => {
  try {
    // Log the start of the database connection process
    console.log("Connecting to the database...");

    // Connect to the MongoDB server with the provided URL and options
    const client = await MongoClient.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Select the 'nodebucket' database
    const db = client.db("nodebucket");
    // Log successful database connection
    console.log("Connected to the database!");

    // Perform the operations passed to the 'mongo' function
    await operations(db);
    // Log successful operation execution
    console.log("Operation was successful!");

    // Close the database connection
    client.close();
    // Log successful disconnection from the database
    console.log("Disconnected from the database.");
  } catch (err) {
    // Create a new error object and log the error
    const error = new Error("Error connecting to the database:", err);
    error.status = 500;
    console.error("Error connecting to the database:", err);
    // Call the 'next' function with the error object
    next(error);
  }
};

// Export the 'mongo' function
module.exports = { mongo };
