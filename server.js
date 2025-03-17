const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require('path');
const cookieParser = require("cookie-parser");
const multer = require('multer');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

const db = mysql.createConnection({
     host: "localhost",
    user: "root",
    password: "root",
    database: "hotel"
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "home.html"));
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed: " + err.stack);
        return;
    }
    console.log("Connected to MySQL Database");
});
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const findUserQuery = "SELECT * FROM admins WHERE email = ?";
    db.query(findUserQuery, [email], (err, results) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ message: "Database Error" });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: "Email not found!" });
        }

        const storedPassword = results[0].password; // Fetch stored password

        // ✅ Compare plain text passwords directly
        if (password !== storedPassword) {
            return res.status(401).json({ message: "Incorrect password!" });
        }

        res.status(200).json({ message: "Login successful!" });
    });
});

// 🔹 Login Route: Check if Customer Exists
app.post("/login_cust", (req, res) => {
    const { name, password } = req.body;

    if (!name || !password) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const checkUserQuery = "SELECT * FROM customers WHERE name = ? AND password = ?";
    db.query(checkUserQuery, [name, password], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: "Database error" });

        if (results.length > 0) {
            res.json({ success: true, message: "Login successful!", redirect: "list.html" });
        } else {
            res.json({ success: false, message: "User not found. Redirecting to registration.", redirect: "regform.html" });
        }
    });
});

// 🔹 Registration Route: Insert New Customer and Redirect to custform.html
app.post("/register_cust", (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    
        const insertQuery = "INSERT INTO customers (name, email, password) VALUES (?, ?, ?)";
        db.query(insertQuery, [name, email, password], (err) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Database error" });
            }
            res.json({ success: true, message: "Registration successful!", redirect: "cust.html" });
        });
    });

// 🔹 Login Route: Check if Customer Exists
app.post("/login_hotel", (req, res) => {
    const { name, password } = req.body;

    if (!name || !password) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const checkUserQuery = "SELECT * FROM hoteluser WHERE name = ? AND password = ?";
    db.query(checkUserQuery, [name, password], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: "Database error" });

        if (results.length > 0) {
            res.json({ success: true, message: "Login successful!", redirect: "hotelpage.html" });
        } else {
            res.json({ success: false, message: "User not found. Redirecting to registration.", redirect: "hotelregform.html" });
        }
    });
});

// 🔹 Registration Route: Insert New Customer and Redirect to custform.html
app.post("/register_hotel", (req, res) => {
    const { name,  password,hotelname, address } = req.body;

    if (!name  || !password  || !hotelname || !address) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

          
        const insertQuery = "INSERT INTO hoteluser (name, password, hotelname,address) VALUES (?, ?, ?,? )";
        console.log(insertQuery);
        db.query(insertQuery, [name, password, hotelname, address], (err) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Database error" });
            }
            res.json({ success: true, message: "Registration successful!", redirect: "homepage.html" });
        });
    });



app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});