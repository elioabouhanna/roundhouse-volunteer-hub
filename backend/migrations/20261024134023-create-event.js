'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('events', {
            event_id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },

            title: {
                type: Sequelize.STRING(150),
                allowNull: false
            },

            description: {
                type: Sequelize.TEXT,
                allowNull: true
            },

            location: {
                type: Sequelize.STRING(150),
                allowNull: true
            },

            event_date: {
                type: Sequelize.DATEONLY,
                allowNull: false
            },

            status: {
                type: Sequelize.ENUM('upcoming', 'completed', 'cancelled'),
                allowNull: false,
                defaultValue: 'upcoming'
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
        await queryInterface.dropTable('events');
    }
};