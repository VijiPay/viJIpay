import sequelize from "./sequelize.js";
import User from "./users.model.js";
import {Sequelize} from "sequelize";
import Transaction from "./transactions.model.js";
import Role from "./role.model.js";

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.users = User(sequelize, Sequelize);
db.transations = Transaction(sequelize, Sequelize);
db.roles = Role(sequelize, Sequelize);

export default db;