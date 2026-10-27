'use strict';

const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Event extends Model {
        static associate(models) {
            Event.hasMany(models.Shift, {
                foreignKey: 'event_id',
                as: 'shifts',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            });
        }
    }

    Event.init({
        event_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        title: {
            type: DataTypes.STRING(150),
            allowNull: false
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        location: {
            type: DataTypes.STRING(150),
            allowNull: true
        },

        event_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },

        status: {
            type: DataTypes.ENUM('upcoming', 'completed', 'cancelled'),
            allowNull: false,
            defaultValue: 'upcoming'
        }
    }, {
        sequelize,
        modelName: 'Event',
        tableName: 'events',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return Event;
};