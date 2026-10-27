'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('volunteers', {
            volunteer_id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },

            first_name: {
                type: Sequelize.STRING(100),
                allowNull: false
            },

            last_name: {
                type: Sequelize.STRING(100),
                allowNull: false
            },

            email: {
                type: Sequelize.STRING(150),
                allowNull: true,
                unique: true
            },

            phone: {
                type: Sequelize.STRING(30),
                allowNull: true
            },

            status: {
                type: Sequelize.ENUM('active', 'inactive'),
                allowNull: false,
                defaultValue: 'active'
            },

            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },

            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('volunteers');
    }
};