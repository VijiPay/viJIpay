import { INTEGER, Model } from "sequelize";

class RefreshToken extends Model {}

export default (sequelize, Sequelize) => {
  RefreshToken.init(
    {
      token: {
        type: Sequelize.STRING,
          },
          userId: {
            type: INTEGER
        },
      expiryDate: {
        type: Sequelize.DATE,
      },
    },
    {
      sequelize,
      modelName: "RefreshToken",
    }
  );

  return RefreshToken;
};
