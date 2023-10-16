import { Model, DataTypes } from "sequelize";
// import sequelize from "./sequelize.js";
class Transaction extends Model {
    static associate(models) {
        // Define associations with other models if needed
    }
}

export default (sequelize, Sequelize) => {
    Transaction.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            product: {
                type: DataTypes.JSONB,
                allowNull: false
            },
            transaction_details: {
                type: Sequelize.JSONB,
                allowNull: false
            },
            status: {
                type: Sequelize.STRING,
                allowNull: false,
                enum: ['created', 'pending', 'started', 'completed', 'dispute'],
                defaultValue: 'created'
            }
            // Add more attributes as needed
        },
        {
            sequelize,
            modelName: "Transaction",
        }
    );

    return Transaction;
}


