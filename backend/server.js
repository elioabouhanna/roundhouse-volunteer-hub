require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/api/health", (req, res) => {
    res.json({
        message: "Roundhouse Volunteer Hub API is running"
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});