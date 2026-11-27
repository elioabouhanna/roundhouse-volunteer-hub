
const express = require("express");
const { rateLimit } = require("express-rate-limit");

const router = express.Router();

const authController = require("../controllers/authController");


// Login rate limiter
const loginLimiter = rateLimit({

    windowMs: 15 * 60 * 1000,

    limit: 10,

    standardHeaders: true,

    legacyHeaders: false,

    handler: (req, res) => {

        return res.redirect("/login?error=limited");

    }

});


// Authentication routes
router.post("/login", loginLimiter, authController.login);

router.post("/logout", authController.logout);


module.exports = router;
