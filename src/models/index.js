import config from "../config/db.config.js";
import Product from "./product.model.js";
import User from "./users.model.js";
import {Sequelize} from "sequelize";
import Transaction from "./transactions.model.js";
import sequelize from "./sequelize.js";

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
// db.products = Product(sequelize, Sequelize);
db.users = User(sequelize, Sequelize);
db.transations = Transaction(sequelize, Sequelize);

export default db;