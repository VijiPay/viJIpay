import sequelize from "./sequelize.js";
import User from "./users.model.js";
import {Sequelize} from "sequelize";
import Transaction from "./transactions.model.js";
import Role from "./role.model.js";
import Payment from "./payment.model.js";
import Dispute from "./dispute.model.js";
import RefeshToken from "./refreshToken.model.js";
import sendEmail from "./email.model.js";

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.users = User(sequelize, Sequelize);
db.transations = Transaction(sequelize, Sequelize);
db.roles = Role(sequelize, Sequelize);
db.payments = Payment(sequelize, Sequelize);
db.dispute = Dispute(sequelize, Sequelize);
db.refreshToken = RefeshToken(sequelize, Sequelize);
db.mail = sendEmail;


db.refreshToken.belongsTo(db.users, {
    foreignKey: 'userId', targetKey: 'id'
})
db.users.hasOne(db.refreshToken, {
    foreignKey: 'userId', targetKey: 'id'
})

export default db;