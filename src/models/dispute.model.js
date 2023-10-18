import { Model } from "sequelize";

class Dispute extends Model {
  
}

export default (sequelize, Sequelize) => {
  Dispute.init(
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      reason: {
        type: Sequelize.JSONB,
        allowNull: false
      },
      transaction_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      decision: {
        type: Sequelize.STRING,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('open', 'closed'),
        defaultValue: 'open'
      },
     buyer_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      seller_phone: {
        type: Sequelize.STRING,
        allowNull: false
      },
},
{
  sequelize,
  modelName: "Dispute",
}
    );
    return Dispute;
}



  