'use strict';

const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Skill extends Model {
        static associate(models) {
            Skill.belongsToMany(models.Volunteer, {
                through: models.VolunteerSkill,
                foreignKey: 'skill_id',
                otherKey: 'volunteer_id',
                as: 'volunteers'
            });
        }
    }

    Skill.init({
        skill_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        skill_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        }
    }, {
        sequelize,
        modelName: 'Skill',
        tableName: 'skills',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return Skill;
};