'use strict';

const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class VolunteerAccount extends Model {
        static associate(models) {
            VolunteerAccount.belongsTo(models.Volunteer, {
                foreignKey: 'volunteer_id',
                as: 'volunteer',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            });
        }
    }

    VolunteerAccount.init({
        account_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        volunteer_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        },

        email: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true
        },

        password_hash: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'VolunteerAccount',
        tableName: 'volunteer_accounts',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return VolunteerAccount;
};