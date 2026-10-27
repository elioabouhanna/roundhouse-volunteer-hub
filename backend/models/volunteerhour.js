'use strict';

const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class VolunteerHour extends Model {
        static associate(models) {
            VolunteerHour.belongsTo(models.Volunteer, {
                foreignKey: 'volunteer_id',
                as: 'volunteer',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            });

            VolunteerHour.belongsTo(models.Shift, {
                foreignKey: 'shift_id',
                as: 'shift',
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE'
            });
        }
    }

    VolunteerHour.init({
        hours_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        volunteer_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        shift_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },

        hours_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },

        hours: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'VolunteerHour',
        tableName: 'volunteer_hours',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return VolunteerHour;
};