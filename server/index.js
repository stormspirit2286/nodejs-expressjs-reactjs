import express from "express";
import mysql from "mysql2";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "login",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to database: " + err);
    return;
  }
  // var sql =
  //   "CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), email VARCHAR(255), password VARCHAR(255))";

  // // Thực hiện câu lệnh SQL
  // db.query(sql, function (err, result) {
  //   if (err) throw err;
  //   console.log("Bảng đã được tạo!");
  // });
  console.log("Connected to database with id " + db.threadId);
});

app.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const values = [req.body.name, req.body.email, hashedPassword];
    const sql =
      "INSERT INTO users(`name`, `email`, `password`) values (?, ?, ?)";

    await db.promise().query(sql, values);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not register new user" });
  }
});

app.listen(3001, () => {
  console.log("Server is listening on port: 3001");
});
