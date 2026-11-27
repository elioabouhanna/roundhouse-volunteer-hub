
const {
    StaffUser,
    Volunteer,
    VolunteerAccount
} = require("../models");


// Destroy an invalid session
function invalidateSession(req, res) {

    req.session.destroy((err) => {

        if (err) {
            console.error("Session error:", err);
            return res.status(500).send("Internal server error");
        }

        res.clearCookie("connect.sid", { path: "/" });

        return res.redirect("/login");
    });
}


// Check authentication and account validity
async function requireAuth(req, res, next) {

    try {

        if (!req.session || !req.session.userId) {
            return res.redirect("/login");
        }

        if (req.session.role === "staff") {

            const staff = await StaffUser.findByPk(
                req.session.userId
            );

            if (!staff) {
                return invalidateSession(req, res);
            }

        } else if (req.session.role === "volunteer") {

            const account = await VolunteerAccount.findOne({

                where: {
                    account_id: req.session.userId,
                    volunteer_id: req.session.volunteerId
                },

                include: [
                    {
                        model: Volunteer,
                        as: "volunteer"
                    }
                ]
            });

            if (
                !account ||
                !account.volunteer ||
                account.volunteer.status !== "active"
            ) {
                return invalidateSession(req, res);
            }

        } else {

            return invalidateSession(req, res);
        }

        res.set("Cache-Control", "no-store");

        return next();

    } catch (error) {

        console.error("Authorization error:", error);

        return res.status(500).send("Internal server error");
    }
}


// Staff-only access
function requireStaff(req, res, next) {

    return requireAuth(req, res, () => {

        if (req.session.role !== "staff") {
            return res.status(403).send("Access denied");
        }

        return next();
    });
}


// Volunteer-only access
function requireVolunteer(req, res, next) {

    return requireAuth(req, res, () => {

        if (req.session.role !== "volunteer") {
            return res.status(403).send("Access denied");
        }

        return next();
    });
}


module.exports = {
    requireAuth,
    requireStaff,
    requireVolunteer
};
