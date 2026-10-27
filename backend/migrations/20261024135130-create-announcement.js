'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('announcements', {
            announcement_id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },

            title: {
                type: Sequelize.STRING(150),
                allowNull: false
            },

            message: {
                type: Sequelize.TEXT,
                allowNull: false
            },

            created_by: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'staff_users',
                    key: 'user_id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
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
        await queryInterface.dropTable('announcements');
    }
};