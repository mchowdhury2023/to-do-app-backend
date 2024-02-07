const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

const bcrypt = require("bcrypt");
const saltRounds = 10;

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

// POST Endpoint: Register a New User
app.post("/users/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  let sql = "INSERT INTO users (username, password) VALUES (?, ?)";
  db.query(sql, [username, hashedPassword], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error registering new user");
    } else {
      res.send("User registered successfully");
    }
  });
});

// GET Endpoint: Fetch All Users
app.get("/users", (req, res) => {
  let sql = "SELECT id, username FROM users";
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// POST Endpoint: Authenticate a User
app.post("/users/login", (req, res) => {
  const { username, password } = req.body;

  let sql = "SELECT * FROM users WHERE username = ?";
  db.query(sql, [username], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Server error");
    }
    if (results.length > 0) {
      const comparison = await bcrypt.compare(password, results[0].password);
      if (comparison) {
        // Login successful
        return res.send("Login successful");
      } else {
        // Password does not match
        return res.status(401).send("Invalid credentials");
      }
    } else {
      // User not found
      return res.status(404).send("User not found");
    }
  });
});

// DELETE Endpoint: Delete a User
app.delete("/users/:id", (req, res) => {
  let sql = "DELETE FROM users WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error deleting user");
    } else {
      res.send("User deleted successfully");
    }
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
