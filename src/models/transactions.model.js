export default (sequelize, Sequelize) => {
    const Transaction = sequelize.define('transactions', {
      transaction_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      buyer_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      seller_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Pending'
      },
      amount: {
        type: Sequelize.FLOAT,
        allowNull: false
      }
    }, {
      timestamps: false
    });
  
    return Transaction;
  };
  