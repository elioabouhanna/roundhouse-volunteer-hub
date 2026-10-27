'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('skills', {
            skill_id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },

            skill_name: {
                type: Sequelize.STRING(100),
                allowNull: false,
                unique: true
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
        await queryInterface.dropTable('skills');
    }
};