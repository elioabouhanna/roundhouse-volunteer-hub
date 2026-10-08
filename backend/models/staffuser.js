"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class StaffUser extends Model {
        static associate(models) {
            // Relationships can be added later
        }
    }

    StaffUser.init(
        {
            user_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },

            name: {
                type: DataTypes.STRING(100),
                allowNull: false
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
        },
        {
            sequelize,
            modelName: "StaffUser",
            tableName: "staff_users",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
    );

    return StaffUser;
};