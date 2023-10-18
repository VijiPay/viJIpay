import sequelize from "./sequelize.js";
import User from "./users.model.js";
import {Sequelize} from "sequelize";
import Transaction from "./transactions.model.js";
import Role from "./role.model.js";
import Payment from "./payment.model.js";
import Dispute from "./dispute.model.js";

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.users = User(sequelize, Sequelize);
db.transations = Transaction(sequelize, Sequelize);
db.roles = Role(sequelize, Sequelize);
db.payments = Payment(sequelize, Sequelize);
db.dispute = Dispute(sequelize, Sequelize);

export default db;