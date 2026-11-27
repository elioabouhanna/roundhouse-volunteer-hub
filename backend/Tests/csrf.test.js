
const test = require("node:test");
const assert = require("node:assert/strict");

const {
    getCsrfToken,
    requireCsrf
} = require("../middleware/csrfMiddleware");


// Simulate an HTTP request
function createRequest(method, session, body = {}, headers = {}) {

    return {
        method,
        session,
        body,

        get(name) {
            return headers[name.toLowerCase()];
        }
    };
}


// Simulate an HTTP response
function createResponse() {

    return {
        statusCode: 200,
        message: null,

        status(code) {
            this.statusCode = code;
            return this;
        },

        send(message) {
            this.message = message;
            return this;
        }
    };
}


// Test helper
function executeMiddleware(req) {

    const res = createResponse();

    let allowed = false;

    requireCsrf(req, res, () => {
        allowed = true;
    });

    return { res, allowed };
}


// TEST 1
test("CSRF token is generated correctly", () => {

    const req = { session: {} };

    const token = getCsrfToken(req);

    assert.match(token, /^[a-f0-9]{64}$/);
    assert.equal(req.session.csrfToken, token);

});


// TEST 2
test("The same session keeps the same token", () => {

    const req = { session: {} };

    const firstToken = getCsrfToken(req);
    const secondToken = getCsrfToken(req);

    assert.equal(firstToken, secondToken);

});


// TEST 3
test("Different sessions receive different tokens", () => {

    const firstToken = getCsrfToken({ session: {} });
    const secondToken = getCsrfToken({ session: {} });

    assert.notEqual(firstToken, secondToken);

});


// TEST 4
test("Read-only requests do not require CSRF tokens", () => {

    for (const method of ["GET", "HEAD", "OPTIONS"]) {

        const req = createRequest(method, {});

        const { allowed } = executeMiddleware(req);

        assert.equal(allowed, true);

    }

});


// TEST 5
test("Valid form token is accepted", () => {

    const session = {};

    const token = getCsrfToken({ session });

    const req = createRequest("POST", session, {
        _csrf: token
    });

    const { allowed } = executeMiddleware(req);

    assert.equal(allowed, true);

});


// TEST 6
test("Valid header token is accepted", () => {

    const session = {};

    const token = getCsrfToken({ session });

    const req = createRequest(
        "POST",
        session,
        {},
        { "x-csrf-token": token }
    );

    const { allowed } = executeMiddleware(req);

    assert.equal(allowed, true);

});


// TEST 7
test("Missing CSRF token is rejected", () => {

    const session = {};

    getCsrfToken({ session });

    const req = createRequest("POST", session);

    const { res, allowed } = executeMiddleware(req);

    assert.equal(allowed, false);
    assert.equal(res.statusCode, 403);

});


// TEST 8
test("Malformed CSRF token is rejected", () => {

    const session = {};

    getCsrfToken({ session });

    const req = createRequest("POST", session, {
        _csrf: "invalid-token"
    });

    const { res, allowed } = executeMiddleware(req);

    assert.equal(allowed, false);
    assert.equal(res.statusCode, 403);

});


// TEST 9
test("Token from another session is rejected", () => {

    const firstSession = {};
    const secondSession = {};

    getCsrfToken({ session: firstSession });

    const secondToken = getCsrfToken({
        session: secondSession
    });

    const req = createRequest("POST", firstSession, {
        _csrf: secondToken
    });

    const { res, allowed } = executeMiddleware(req);

    assert.equal(allowed, false);
    assert.equal(res.statusCode, 403);

});


// TEST 10
test("State-changing requests require CSRF protection", () => {

    for (const method of ["POST", "PUT", "PATCH", "DELETE"]) {

        const req = createRequest(method, {});

        const { res, allowed } = executeMiddleware(req);

        assert.equal(allowed, false);
        assert.equal(res.statusCode, 403);

    }

});
