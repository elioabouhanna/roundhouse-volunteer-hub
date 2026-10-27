'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('volunteer_skills', {
            volunteer_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'volunteers',
                    key: 'volunteer_id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },

            skill_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'skills',
                    key: 'skill_id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
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
        await queryInterface.dropTable('volunteer_skills');
    }
};