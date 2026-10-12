
const express = require("express");
const mysql = require("mysql2/promise");

const app = express();
app.use(express.json());

const pool = mysql.createPool({
    host: process.env.DB_HOST || "mysql",
    user: process.env.DB_USER || "studentuser",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "studentdb",
    waitForConnections: true,
    connectionLimit: 10,
});

app.get("/", (req, res) => {
    res.json({ message: "Student Docker API is running" });
});

app.get("/students", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM students");
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

app.post("/students", async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                error: "Name and email are required"
            });
        }

        const [result] = await pool.execute(
            "INSERT INTO students (name, email) VALUES (?, ?)",
            [name, email]
        );

        res.status(201).json({
            id: result.insertId,
            name,
            email
        });
    } catch (err) {
        console.error(err);
        res.status(err.code === "ER_DUP_ENTRY" ? 409 : 500).json({
            error: err.code === "ER_DUP_ENTRY"
                ? "Email already exists"
                : "Database error"
        });
    }
});

app.listen(5000, "0.0.0.0", () => {
    console.log("API running on port 5000");
});
