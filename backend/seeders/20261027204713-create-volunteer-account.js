'use strict';

const bcrypt = require('bcrypt');
const path = require('path');

require('dotenv').config({
    path: path.resolve(__dirname, '../.env')
});

const {
    Volunteer,
    VolunteerAccount
} = require('../models');

module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            const volunteer = await Volunteer.create({
                first_name: process.env.VOLUNTEER_FIRST_NAME,
                last_name: process.env.VOLUNTEER_LAST_NAME,
                email: process.env.VOLUNTEER_EMAIL,
                phone: null,
                status: 'active'
            }, {
                transaction
            });

            const passwordHash = await bcrypt.hash(
                process.env.VOLUNTEER_PASSWORD,
                10
            );

            await VolunteerAccount.create({
                volunteer_id: volunteer.volunteer_id,
                email: process.env.VOLUNTEER_EMAIL,
                password_hash: passwordHash
            }, {
                transaction
            });

            await transaction.commit();

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    async down(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            const volunteer = await Volunteer.findOne({
                where: {
                    email: process.env.VOLUNTEER_EMAIL
                },
                transaction
            });

            if (volunteer) {
                await VolunteerAccount.destroy({
                    where: {
                        volunteer_id: volunteer.volunteer_id
                    },
                    transaction
                });

                await volunteer.destroy({
                    transaction
                });
            }

            await transaction.commit();

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
};