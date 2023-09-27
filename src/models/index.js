import config from "../config/db.config.js";
import Product from "./product.model.js";
import User from "./users.model.js";
import Sequelize from "sequelize";
import Transaction from "./transactions.model.js";
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
    host: config.HOST,
    dialect: config.dialect,
    logging: false,

    pool: {
        max: config.pool.max,
        min: config.pool.min,
        acquire: config.pool.acquire,
        idle: config.pool.idle,
    },
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.products = Product(sequelize, Sequelize);
db.users = User(sequelize, Sequelize);
db.transations = Transaction(sequelize, Sequelize);
export default db;