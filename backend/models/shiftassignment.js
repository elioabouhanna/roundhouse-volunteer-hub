'use strict';

const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ShiftAssignment extends Model {
        static associate(models) {
            ShiftAssignment.belongsTo(models.Shift, {
                foreignKey: 'shift_id',
                as: 'shift',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            });

            ShiftAssignment.belongsTo(models.Volunteer, {
                foreignKey: 'volunteer_id',
                as: 'volunteer',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            });
        }
    }

    ShiftAssignment.init({
        assignment_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        shift_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        volunteer_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        assigned_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        sequelize,
        modelName: 'ShiftAssignment',
        tableName: 'shift_assignments',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            {
                unique: true,
                fields: ['shift_id', 'volunteer_id']
            }
        ]
    });

    return ShiftAssignment;
};