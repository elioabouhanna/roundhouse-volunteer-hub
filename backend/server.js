
require("dotenv").config();

const express = require("express");
const session = require("express-session");
const path = require("path");
const fs = require("fs/promises");

const authRoutes = require("./routes/authRoutes");

const {
    requireStaff,
    requireVolunteer
} = require("./middleware/authMiddleware");

const {
    getCsrfToken,
    requireCsrf
} = require("./middleware/csrfMiddleware");

const app = express();

const frontendPath = path.join(__dirname, "../frontend");

const isProduction = process.env.NODE_ENV === "production";


// Validate required configuration
if (!process.env.SESSION_SECRET) {

    throw new Error(
        "SESSION_SECRET is missing from the .env file"
    );

}


// Disable unnecessary server information
app.disable("x-powered-by");


// Parse form and JSON data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Secure session configuration
app.use(

    session({

        secret: process.env.SESSION_SECRET,

        resave: false,

        saveUninitialized: false,

        cookie: {

            httpOnly: true,

            sameSite: "lax",

            secure: isProduction,

            maxAge: 1000 * 60 * 60 * 2,

            path: "/"

        }

    })

);


// Activate CSRF protection
app.use(requireCsrf);


// Serve HTML pages with a session-specific CSRF token
async function sendPageWithCsrf(req, res, filename) {

    try {

        const html = await fs.readFile(

            path.join(frontendPath, filename),

            "utf8"

        );

        if (!html.includes("__CSRF_TOKEN__")) {

            throw new Error(
                `Missing CSRF placeholder in ${filename}`
            );

        }

        const token = getCsrfToken(req);

        const protectedHtml = html.replaceAll(

            "__CSRF_TOKEN__",

            token

        );

        res.set("Cache-Control", "no-store");

        return res.type("html").send(protectedHtml);

    } catch (error) {

        console.error("Page loading error:", error);

        return res.status(500).send("Internal server error");

    }

}


// Authentication routes
app.use("/auth", authRoutes);


// Public login page
app.get("/login", (req, res) => {

    return sendPageWithCsrf(req, res, "login.html");

});


// Protected staff dashboard
app.get("/", requireStaff, (req, res) => {

    return sendPageWithCsrf(req, res, "index.html");

});


// Protected volunteer dashboard
app.get("/volunteer", requireVolunteer, (req, res) => {

    const token = getCsrfToken(req);

    return res.send(`

        <!DOCTYPE html>

        <html lang="en">

        <head>

            <meta charset="UTF-8">

            <meta name="viewport"
                  content="width=device-width, initial-scale=1">

            <title>Volunteer Dashboard</title>

        </head>

        <body>

            <h1>Volunteer dashboard coming next</h1>

            <form action="/auth/logout" method="POST">

                <input type="hidden"
                       name="_csrf"
                       value="${token}">

                <button type="submit">
                    Logout
                </button>

            </form>

        </body>

        </html>

    `);

});


// Health test
app.get("/api/health", (req, res) => {

    res.json({

        message: "Roundhouse Volunteer Hub API is running"

    });

});


// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`Server running on http://localhost:${PORT}`);

});
