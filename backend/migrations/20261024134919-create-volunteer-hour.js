'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('volunteer_hours', {
            hours_id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },

            volunteer_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'volunteers',
                    key: 'volunteer_id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },

            shift_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'shifts',
                    key: 'shift_id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },

            hours_date: {
                type: Sequelize.DATEONLY,
                allowNull: false
            },

            hours: {
                type: Sequelize.DECIMAL(5, 2),
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
        await queryInterface.dropTable('volunteer_hours');
    }
};