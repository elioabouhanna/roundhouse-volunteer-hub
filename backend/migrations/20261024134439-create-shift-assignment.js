'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('shift_assignments', {
            assignment_id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },

            shift_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'shifts',
                    key: 'shift_id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
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

            assigned_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
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

        await queryInterface.addConstraint('shift_assignments', {
            fields: ['shift_id', 'volunteer_id'],
            type: 'unique',
            name: 'unique_shift_volunteer'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('shift_assignments');
    }
};