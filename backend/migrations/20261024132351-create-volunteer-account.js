'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('volunteer_accounts', {
            account_id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },

            volunteer_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                unique: true,
                references: {
                    model: 'volunteers',
                    key: 'volunteer_id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
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
        await queryInterface.dropTable('volunteer_accounts');
    }
};