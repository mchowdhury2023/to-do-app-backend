const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

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

const app = express();
app.use(express.json());

//create db
app.get("/createdb", (req, res) => {
  let sql = "CREATE DATABASE todo_db2";
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("Database created...");
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
