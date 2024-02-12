import { Sequelize } from "sequelize";
import dotenv from 'dotenv';
dotenv.config();

let { HOST, DATABASE, DBUSER, DBPASSWORD } = process.env;

const sequelize = new Sequelize(DATABASE, DBUSER, DBPASSWORD, {
    host: HOST,
    dialect: 'postgres',
    logging: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 20000,
    },
    port: 5432,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false, // set this to true in production after configuring SSL certificates
        },
    },
});

export default sequelize;
