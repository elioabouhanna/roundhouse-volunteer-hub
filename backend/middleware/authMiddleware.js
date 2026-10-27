function requireAuth(req, res, next) {
    if (!req.session.userId) {
        return res.redirect("/login");
    }

    next();
}

function requireStaff(req, res, next) {
    if (!req.session.userId) {
        return res.redirect("/login");
    }

    if (req.session.role !== "staff") {
        return res.status(403).send("Access denied");
    }

    next();
}

function requireVolunteer(req, res, next) {
    if (!req.session.userId) {
        return res.redirect("/login");
    }

    if (req.session.role !== "volunteer") {
        return res.status(403).send("Access denied");
    }

    next();
}

module.exports = {
    requireAuth,
    requireStaff,
    requireVolunteer
};