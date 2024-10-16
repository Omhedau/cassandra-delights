require("dotenv").config();
require("express-async-errors");
const connectDB = require("./db/connect"); // Import your Cassandra connection
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// Routers
const userRouter = require("./routes/user");
const recipeRouter = require("./routes/recipe");
const commentRouter = require("./routes/comment");

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files from the React app
app.use(express.static(path.resolve(__dirname, "client", "build")));


app.use("/api/v1", userRouter);
// app.use("/api/v1/recipe", recipeRouter);
// app.use("/api/v1/comment", commentRouter);

// Catch-all route: Serve React's index.html for any other routes
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

// Start Server
const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB.connect(); // Connect to Cassandra
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();



