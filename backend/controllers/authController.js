const bcrypt = require("bcrypt");
const { StaffUser } = require("../models");

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await StaffUser.findOne({
            where: { email }
        });

        if (!user) {
            return res.redirect("/login?error=invalid");
        }

        const passwordIsValid = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordIsValid) {
            return res.redirect("/login?error=invalid");
        }

        req.session.regenerate((err) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Login error");
            }

            req.session.userId = user.user_id;
            req.session.userName = user.name;

            req.session.save((err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send("Login error");
                }

                res.redirect("/");
            });
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
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