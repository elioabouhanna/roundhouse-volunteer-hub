
const path = require("path");

require("dotenv").config({
    path: path.resolve(__dirname, "../.env")
});


// Common database configuration
const commonConfig = {

    username: process.env.DB_USER,

    password: process.env.DB_PASSWORD,

    host: process.env.DB_HOST || "127.0.0.1",

    port: Number(process.env.DB_PORT) || 3306,

    dialect: "mysql",

    logging: false

};


// Separate test database
const testDatabase =
    process.env.DB_TEST_NAME ||
    "roundhouse_volunteer_hub_test";


// Prevent testing on the development database
if (testDatabase === process.env.DB_NAME) {

    throw new Error(
        "Test and development databases must be different"
    );

}


module.exports = {

    development: {

        ...commonConfig,

        database: process.env.DB_NAME

    },

    test: {

        ...commonConfig,

        database: testDatabase

    }

};
