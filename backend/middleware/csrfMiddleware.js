
const crypto = require("crypto");


// Generate and store a CSRF token in the session
function getCsrfToken(req) {

    if (!req.session.csrfToken) {

        req.session.csrfToken =
            crypto.randomBytes(32).toString("hex");

    }

    return req.session.csrfToken;
}


// Verify CSRF tokens
function requireCsrf(req, res, next) {

    // Read-only requests do not require a token
    if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {

        return next();

    }

    const expectedToken = req.session?.csrfToken;

    const submittedToken =
        req.body?._csrf || req.get("x-csrf-token");


    // Validate token format
    if (
        typeof expectedToken !== "string" ||
        typeof submittedToken !== "string" ||
        !/^[a-f0-9]{64}$/.test(expectedToken) ||
        !/^[a-f0-9]{64}$/.test(submittedToken)
    ) {

        return res.status(403).send("Invalid CSRF token");

    }


    // Securely compare the tokens
    const isValid = crypto.timingSafeEqual(

        Buffer.from(expectedToken, "hex"),

        Buffer.from(submittedToken, "hex")

    );


    if (!isValid) {

        return res.status(403).send("Invalid CSRF token");

    }

    return next();
}


module.exports = {

    getCsrfToken,

    requireCsrf

};
