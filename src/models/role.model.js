import { Model } from "sequelize";

class Role extends Model {
    static associate(models) {
        models.Role.hasMany(models.User, { foreignKey: 'roleId'});

        // models.Role.ROLES = ["user", "admin", "moderator"];
    }
}

export default (sequelize, Sequelize) => {
    Role.init(
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: "Role",
        }
    );

    return Role;
}
