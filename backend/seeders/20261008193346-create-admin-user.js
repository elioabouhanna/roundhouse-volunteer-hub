"use strict";

const bcrypt = require("bcrypt");
const path = require("path");

require("dotenv").config({
    path: path.resolve(__dirname, "../.env")
});

module.exports = {
    async up(queryInterface) {
        const passwordHash = await bcrypt.hash(
            process.env.ADMIN_PASSWORD,
            10
        );

        await queryInterface.bulkInsert("staff_users", [
            {
                name: process.env.ADMIN_NAME,
                email: process.env.ADMIN_EMAIL,
                password_hash: passwordHash,
                created_at: new Date(),
                updated_at: new Date()
            }
        ]);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete(
            "staff_users",
            {
                email: process.env.ADMIN_EMAIL
            }
        );
    }
};
