const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

const app = express();

const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());

// Create a connection to the database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "BangladesH1981",
  database: "todo_db",
});

//connect
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("connected");
});

// GET Endpoint: Retrieve Tasks
app.get("/tasks", (req, res) => {
  let sql = "SELECT * FROM tasks";
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// POST Endpoint: Add a New Task
app.post("/tasks", (req, res) => {
  let task = {
    name: req.body.name,
    description: req.body.description,
    status: "pending",
  };
  let sql = "INSERT INTO tasks SET ?";
  db.query(sql, task, (err, result) => {
    if (err) throw err;
    res.send("Task added.");
  });
});

// PUT Endpoint: Update an Existing Task
app.put("/tasks/:id", (req, res) => {
  let sql =
    "UPDATE tasks SET name = ?, description = ?, status = ? WHERE id = ?";
  db.query(
    sql,
    [req.body.name, req.body.description, req.body.status, req.params.id],
    (err, result) => {
      if (err) throw err;
      res.send("Task updated successfully.");
    }
  );
});

// DELETE Endpoint: Delete a Task
app.delete("/tasks/:id", (req, res) => {
  let sql = "DELETE FROM tasks WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.send("Task deleted successfully.");
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
