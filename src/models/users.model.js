import { Model } from "sequelize";

class User extends Model {
  static associate(models) {
    models.User.belongsTo(models.Role, { foreignKey: 'roleId' });
  }
  
}

export default (sequelize, Sequelize) => {
  User.init(
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      password_hash: {
        type: Sequelize.STRING,
        allowNull: false
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true
      },
      gender: {
        type: Sequelize.STRING,
        allowNull: true
      },
      dob: {
        type: Sequelize.DATE,
        allowNull: true
      },
      roleId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      resetPasswordToken: {
        type: Sequelize.STRING,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('active', 'suspended', 'inactive'),
        defaultValue: 'active'
      },
      email_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      verificationToken: {
        type: Sequelize.STRING,
        allowNull: true
      },
      verificationTokenExpiration: {
        type: Sequelize.DATE,
        allowNull: true
      },
      isSeller: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      }
},
{
  sequelize,
  modelName: "User",
}
    );
    return User;
}



  