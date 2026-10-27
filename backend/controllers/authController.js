const bcrypt = require("bcrypt");
const {
    StaffUser,
    VolunteerAccount,
    Volunteer
} = require("../models");

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.redirect("/login?error=missing");
        }

        // -------------------------------------------------
        // 1. Try Staff Login
        // -------------------------------------------------
        const staffUser = await StaffUser.findOne({
            where: { email: email.trim() }
        });

        if (staffUser) {
            const passwordIsValid = await bcrypt.compare(
                password,
                staffUser.password_hash
            );

            if (passwordIsValid) {
                return req.session.regenerate((err) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send("Login error");
                    }

                    req.session.userId = staffUser.user_id;
                    req.session.userName = staffUser.name;
                    req.session.role = "staff";

                    req.session.save((err) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).send("Login error");
                        }

                        return res.redirect("/");
                    });
                });
            }
        }

        // -------------------------------------------------
        // 2. Try Volunteer Login
        // -------------------------------------------------
        const volunteerAccount = await VolunteerAccount.findOne({
            where: { email: email.trim() },
            include: [
                {
                    model: Volunteer,
                    as: "volunteer"
                }
            ]
        });

        if (volunteerAccount) {
            const passwordIsValid = await bcrypt.compare(
                password,
                volunteerAccount.password_hash
            );

            if (passwordIsValid) {
                return req.session.regenerate((err) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send("Login error");
                    }

                    req.session.userId = volunteerAccount.account_id;
                    req.session.volunteerId = volunteerAccount.volunteer_id;
                    req.session.role = "volunteer";

                    if (volunteerAccount.volunteer) {
                        req.session.userName =
                            `${volunteerAccount.volunteer.first_name} ${volunteerAccount.volunteer.last_name}`;
                    } else {
                        req.session.userName = "Volunteer";
                    }

                    req.session.save((err) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).send("Login error");
                        }

                        return res.redirect("/volunteer");
                    });
                });
            }
        }

        // Neither staff nor volunteer credentials matched
        return res.redirect("/login?error=invalid");

    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
    }
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Logout error");
        }

        res.redirect("/login");
    });
};