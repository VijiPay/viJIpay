import { Model, DataTypes } from "sequelize";
class Payment extends Model {
    static associate(models) {
        // Define associations with other models if needed
    }
}

export default (sequelize, Sequelize) => {
    Payment.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            amount: {
                type: DataTypes.DECIMAL,
                allowNull: false
            },
            buyerId: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            fee: {
                type: Sequelize.DECIMAL,
                allowNull: false
            },
            reference: {
                type: Sequelize.STRING,
                allowNull: false
            },
            sellerId: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            success: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            totalCollected: {
                type: Sequelize.DECIMAL,
                allowNull: false
            },
            transactionId: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            // Add more attributes as needed
        },
        {
            sequelize,
            modelName: "Payment",
        }
    );

    return Payment;
}


