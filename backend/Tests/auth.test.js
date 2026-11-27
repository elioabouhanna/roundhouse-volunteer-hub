
const test = require("node:test");
const assert = require("node:assert/strict");
const bcrypt = require("bcrypt");


// Mock database models
const models = {

    StaffUser: {
        async findOne() { return null; },
        async findByPk() { return null; }
    },

    VolunteerAccount: {
        async findOne() { return null; }
    },

    Volunteer: {}

};


// Replace database models during unit testing
const modelsPath = require.resolve("../models");

require.cache[modelsPath] = {
    id: modelsPath,
    filename: modelsPath,
    loaded: true,
    exports: models
};


const authController = require("../controllers/authController");

const {
    requireAuth,
    requireStaff,
    requireVolunteer
} = require("../middleware/authMiddleware");


// Test credentials
const password = "TestPassword123!";

const passwordHash = bcrypt.hashSync(password, 4);


// Mock staff account
const staff = {
    user_id: 1,
    name: "Test Staff",
    email: "staff@example.com",
    password_hash: passwordHash
};


// Mock volunteer account
function createVolunteerAccount(status = "active") {

    return {
        account_id: 1,
        volunteer_id: 1,
        email: "volunteer@example.com",
        password_hash: passwordHash,

        volunteer: {
            volunteer_id: 1,
            first_name: "Test",
            last_name: "Volunteer",
            status
        }
    };
}


// Simulate an HTTP request and session
function createRequest(body = {}, sessionData = {}) {

    const req = { body };

    function createSession(data = {}) {

        return {
            ...data,

            regenerate(callback) {
                req.session = createSession();
                callback(null);
            },

            save(callback) {
                callback(null);
            },

            destroy(callback) {
                req.session = null;
                callback(null);
            }
        };
    }

    req.session = createSession(sessionData);

    return req;
}


// Simulate an HTTP response
function createResponse() {

    return {

        statusCode: 200,
        redirectUrl: null,
        message: null,
        cookieCleared: false,
        headers: {},

        redirect(url) {
            this.statusCode = 302;
            this.redirectUrl = url;
            return this;
        },

        status(code) {
            this.statusCode = code;
            return this;
        },

        send(message) {
            this.message = message;
            return this;
        },

        clearCookie() {
            this.cookieCleared = true;
            return this;
        },

        set(name, value) {
            this.headers[name] = value;
            return this;
        }

    };
}


// TEST 1 - Successful staff login
test("Staff can log in with valid credentials", async (t) => {

    t.mock.method(
        models.StaffUser,
        "findOne",
        async () => staff
    );

    const req = createRequest({
        email: staff.email,
        password
    });

    const res = createResponse();

    await authController.login(req, res);

    assert.equal(req.session.role, "staff");
    assert.equal(req.session.userId, 1);
    assert.equal(res.redirectUrl, "/");

});


// TEST 2 - Successful volunteer login
test("Active volunteer can log in", async (t) => {

    t.mock.method(
        models.VolunteerAccount,
        "findOne",
        async () => createVolunteerAccount()
    );

    const req = createRequest({
        email: "volunteer@example.com",
        password
    });

    const res = createResponse();

    await authController.login(req, res);

    assert.equal(req.session.role, "volunteer");
    assert.equal(req.session.volunteerId, 1);
    assert.equal(res.redirectUrl, "/volunteer");

});


// TEST 3 - Inactive volunteer login
test("Inactive volunteer cannot log in", async (t) => {

    t.mock.method(
        models.VolunteerAccount,
        "findOne",
        async () => createVolunteerAccount("inactive")
    );

    const req = createRequest({
        email: "volunteer@example.com",
        password
    });

    const res = createResponse();

    await authController.login(req, res);

    assert.equal(res.redirectUrl, "/login?error=invalid");
    assert.equal(req.session.userId, undefined);

});


// TEST 4 - Incorrect password
test("Incorrect password is rejected", async (t) => {

    t.mock.method(
        models.StaffUser,
        "findOne",
        async () => staff
    );

    const req = createRequest({
        email: staff.email,
        password: "wrong-password"
    });

    const res = createResponse();

    await authController.login(req, res);

    assert.equal(res.redirectUrl, "/login?error=invalid");
    assert.equal(req.session.userId, undefined);

});


// TEST 5 - Missing credentials
test("Missing credentials are rejected", async () => {

    const req = createRequest({});
    const res = createResponse();

    await authController.login(req, res);

    assert.equal(res.redirectUrl, "/login?error=missing");

});


// TEST 6 - Invalid input types
test("Invalid credential types are rejected safely", async () => {

    const req = createRequest({
        email: { invalid: true },
        password: 12345
    });

    const res = createResponse();

    await authController.login(req, res);

    assert.equal(res.redirectUrl, "/login?error=missing");

});


// TEST 7 - Missing request body
test("Missing request body is handled safely", async () => {

    const req = createRequest();

    req.body = undefined;

    const res = createResponse();

    await authController.login(req, res);

    assert.equal(res.redirectUrl, "/login?error=missing");

});


// TEST 8 - Logout
test("Logout destroys the session and clears the cookie", () => {

    const req = createRequest({}, {
        userId: 1,
        role: "staff"
    });

    const res = createResponse();

    authController.logout(req, res);

    assert.equal(req.session, null);
    assert.equal(res.cookieCleared, true);
    assert.equal(res.redirectUrl, "/login");

});


// TEST 9 - Unauthenticated access
test("Unauthenticated users cannot access protected pages", async () => {

    const req = createRequest();
    const res = createResponse();

    let allowed = false;

    await requireAuth(req, res, () => {
        allowed = true;
    });

    assert.equal(allowed, false);
    assert.equal(res.redirectUrl, "/login");

});


// TEST 10 - Staff-only access
test("Volunteer cannot access staff pages", async (t) => {

    t.mock.method(
        models.VolunteerAccount,
        "findOne",
        async () => createVolunteerAccount()
    );

    const req = createRequest({}, {
        userId: 1,
        volunteerId: 1,
        role: "volunteer"
    });

    const res = createResponse();

    let allowed = false;

    await requireStaff(req, res, () => {
        allowed = true;
    });

    assert.equal(allowed, false);
    assert.equal(res.statusCode, 403);

});


// TEST 11 - Volunteer-only access
test("Staff cannot access volunteer pages", async (t) => {

    t.mock.method(
        models.StaffUser,
        "findByPk",
        async () => staff
    );

    const req = createRequest({}, {
        userId: 1,
        role: "staff"
    });

    const res = createResponse();

    let allowed = false;

    await requireVolunteer(req, res, () => {
        allowed = true;
    });

    assert.equal(allowed, false);
    assert.equal(res.statusCode, 403);

});


// TEST 12 - Active volunteer session
test("Active volunteer can access volunteer pages", async (t) => {

    t.mock.method(
        models.VolunteerAccount,
        "findOne",
        async () => createVolunteerAccount()
    );

    const req = createRequest({}, {
        userId: 1,
        volunteerId: 1,
        role: "volunteer"
    });

    const res = createResponse();

    let allowed = false;

    await requireVolunteer(req, res, () => {
        allowed = true;
    });

    assert.equal(allowed, true);
    assert.equal(res.headers["Cache-Control"], "no-store");

});


// TEST 13 - Session invalidation
test("Deactivated volunteer loses their existing session", async (t) => {

    t.mock.method(
        models.VolunteerAccount,
        "findOne",
        async () => createVolunteerAccount("inactive")
    );

    const req = createRequest({}, {
        userId: 1,
        volunteerId: 1,
        role: "volunteer"
    });

    const res = createResponse();

    let allowed = false;

    await requireVolunteer(req, res, () => {
        allowed = true;
    });

    assert.equal(allowed, false);
    assert.equal(req.session, null);
    assert.equal(res.cookieCleared, true);
    assert.equal(res.redirectUrl, "/login");

});


// TEST 14 - Deleted staff account
test("Deleted staff account loses access", async () => {

    const req = createRequest({}, {
        userId: 999,
        role: "staff"
    });

    const res = createResponse();

    let allowed = false;

    await requireStaff(req, res, () => {
        allowed = true;
    });

    assert.equal(allowed, false);
    assert.equal(req.session, null);
    assert.equal(res.redirectUrl, "/login");

});
