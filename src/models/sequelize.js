import { Sequelize } from "sequelize";
import dotenv from 'dotenv';
dotenv.config();
let { HOST, DATABASE, DBUSER, DBPASSWORD} = process.env;

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
});

export default sequelize;