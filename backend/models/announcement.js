'use strict';

const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Announcement extends Model {
        static associate(models) {
            Announcement.belongsTo(models.StaffUser, {
                foreignKey: 'created_by',
                as: 'creator',
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE'
            });
        }
    }

    Announcement.init({
        announcement_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        title: {
            type: DataTypes.STRING(150),
            allowNull: false
        },

        message: {
            type: DataTypes.TEXT,
            allowNull: false
        },

        created_by: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'Announcement',
        tableName: 'announcements',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return Announcement;
};