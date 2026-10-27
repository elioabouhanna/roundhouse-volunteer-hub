'use strict';

const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Shift extends Model {
        static associate(models) {
            Shift.belongsTo(models.Event, {
                foreignKey: 'event_id',
                as: 'event',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            });
            Shift.hasMany(models.ShiftAssignment, {
                foreignKey: 'shift_id',
                as: 'assignments',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            });
            Shift.hasMany(models.VolunteerHour, {
                foreignKey: 'shift_id',
                as: 'hours',
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE'
            });
        }
    }

    Shift.init({
        shift_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        event_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        start_time: {
            type: DataTypes.TIME,
            allowNull: false
        },

        end_time: {
            type: DataTypes.TIME,
            allowNull: false
        },

        capacity: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Shift',
        tableName: 'shifts',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return Shift;
};