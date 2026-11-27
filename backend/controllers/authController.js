
const bcrypt = require("bcrypt");

const {
    StaffUser,
    VolunteerAccount,
    Volunteer
} = require("../models");


// Create a secure authenticated session
async function createSession(req, userData) {

    await new Promise((resolve, reject) => {
        req.session.regenerate((err) => {
            if (err) return reject(err);
            resolve();
        });
    });

    Object.assign(req.session, userData);

    await new Promise((resolve, reject) => {
        req.session.save((err) => {
            if (err) return reject(err);
            resolve();
        });
    });
}


// LOGIN
exports.login = async (req, res) => {

    try {

        const { email, password } = req.body || {};

        // Validate input
        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password
        ) {
            return res.redirect("/login?error=missing");
        }

        const cleanEmail = email.trim();

        if (cleanEmail.length > 150) {
            return res.redirect("/login?error=invalid");
        }


        // 1. STAFF LOGIN
        const staffUser = await StaffUser.findOne({
            where: { email: cleanEmail }
        });

        if (staffUser) {

            const passwordIsValid = await bcrypt.compare(
                password,
                staffUser.password_hash
            );

            if (passwordIsValid) {

                await createSession(req, {
                    userId: staffUser.user_id,
                    userName: staffUser.name,
                    role: "staff"
                });

                return res.redirect("/");
            }
        }


        // 2. VOLUNTEER LOGIN
        const volunteerAccount =
            await VolunteerAccount.findOne({

                where: { email: cleanEmail },

                include: [
                    {
                        model: Volunteer,
                        as: "volunteer"
                    }
                ]
            });


        if (volunteerAccount) {

            const volunteer = volunteerAccount.volunteer;

            // Reject missing or inactive volunteer profiles
            if (!volunteer || volunteer.status !== "active") {
                return res.redirect("/login?error=invalid");
            }

            const passwordIsValid = await bcrypt.compare(
                password,
                volunteerAccount.password_hash
            );

            if (passwordIsValid) {

                await createSession(req, {
                    userId: volunteerAccount.account_id,
                    volunteerId: volunteerAccount.volunteer_id,
                    userName:
                        `${volunteer.first_name} ${volunteer.last_name}`,
                    role: "volunteer"
                });

                return res.redirect("/volunteer");
            }
        }


        // Invalid credentials
        return res.redirect("/login?error=invalid");

    } catch (error) {

        console.error("Login error:", error);

        return res.status(500).send("Internal server error");
    }
};


// LOGOUT
exports.logout = (req, res) => {

    req.session.destroy((err) => {

        if (err) {

            console.error("Logout error:", err);

            return res.status(500).send("Logout error");
        }

        res.clearCookie("connect.sid", { path: "/" });

        return res.redirect("/login");
    });
};
