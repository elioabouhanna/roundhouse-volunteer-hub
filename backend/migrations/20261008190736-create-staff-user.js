"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("staff_users", {
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },

            name: {
                type: Sequelize.STRING(100),
                allowNull: false
            },

            email: {
                type: Sequelize.STRING(150),
                allowNull: false,
                unique: true
            },

            password_hash: {
                type: Sequelize.STRING(255),
                allowNull: false
            },

            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
            },

            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
            }
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable("staff_users");
    }
};