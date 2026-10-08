require("dotenv").config();

const express = require("express");
const session = require("express-session");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const requireAuth = require("./middleware/authMiddleware");

const app = express();

const frontendPath = path.join(__dirname, "../frontend");


// Parse form and JSON data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Sessions
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,

        cookie: {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 2
        }
    })
);


// Authentication routes
app.use("/auth", authRoutes);


// Login page - public
app.get("/login", (req, res) => {
    res.sendFile(path.join(frontendPath, "login.html"));
});


// Dashboard - protected
app.get("/", requireAuth, (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});


// Health test
app.get("/api/health", (req, res) => {
    res.json({
        message: "Roundhouse Volunteer Hub API is running"
    });
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});