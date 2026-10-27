'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('shifts', {
            shift_id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },

            event_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'events',
                    key: 'event_id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },

            start_time: {
                type: Sequelize.TIME,
                allowNull: false
            },

            end_time: {
                type: Sequelize.TIME,
                allowNull: false
            },

            capacity: {
                type: Sequelize.INTEGER,
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
        await queryInterface.dropTable('shifts');
    }
};