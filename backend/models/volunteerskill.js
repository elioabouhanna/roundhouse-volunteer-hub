'use strict';

const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class VolunteerSkill extends Model {
        static associate(models) {
            VolunteerSkill.belongsTo(models.Volunteer, {
                foreignKey: 'volunteer_id',
                as: 'volunteer',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            });

            VolunteerSkill.belongsTo(models.Skill, {
                foreignKey: 'skill_id',
                as: 'skill',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            });
        }
    }

    VolunteerSkill.init({
        volunteer_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },

        skill_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        }
    }, {
        sequelize,
        modelName: 'VolunteerSkill',
        tableName: 'volunteer_skills',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return VolunteerSkill;
};