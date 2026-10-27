'use strict';

const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Volunteer extends Model {
        static associate(models) {
            Volunteer.hasOne(models.VolunteerAccount, {
                foreignKey: 'volunteer_id',
                as: 'account',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            });
            Volunteer.belongsToMany(models.Skill, {
                through: models.VolunteerSkill,
                foreignKey: 'volunteer_id',
                otherKey: 'skill_id',
                as: 'skills'
            });
            Volunteer.hasMany(models.ShiftAssignment, {
                foreignKey: 'volunteer_id',
                as: 'shiftAssignments',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            });
            Volunteer.hasMany(models.VolunteerHour, {
                foreignKey: 'volunteer_id',
                as: 'hours',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            });
        }
    }

    Volunteer.init({
        volunteer_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        first_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        last_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        email: {
            type: DataTypes.STRING(150),
            allowNull: true,
            unique: true
        },

        phone: {
            type: DataTypes.STRING(30),
            allowNull: true
        },

        status: {
            type: DataTypes.ENUM('active', 'inactive'),
            allowNull: false,
            defaultValue: 'active'
        }
    }, {
        sequelize,
        modelName: 'Volunteer',
        tableName: 'volunteers',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return Volunteer;
};