import { Sequelize } from "sequelize";
import config from "../config/db.config.js";

const sequelize = new Sequelize(config.DB, config.DB_USER, config.DB_PASSWORD, {
    host: config.HOST,
    dialect: config.dialect,
    logging: false,
    dialectOptions: {
        project: config.ENDPOINT_ID,
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
    pool: {
        max: config.pool.max,
        min: config.pool.min,
        acquire: config.pool.acquire,
        idle: config.pool.idle,
    },
});

export default sequelize;``