const { Model, DataTypes } = require("sequelize");

const sequelize = require("../config/connection.js");

class Game extends Model {}

Game.init(
  {
    game_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "user",
        key: "id",
      },
    },
    // created: {
    //   timestamps: true,
    // },
    game_status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // character_id: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    //   references: {
    //     model: "characters",
    //     key: "character_id",
    //   },
    // },
    // game_grid: {
    //   // TO DO: FILL IN
    // },
    // game_position: {
    //   // TO DO: FILL IN
    // },
    // game_points: {
    //   // TO DO: FILL IN
    // },
  },
  {
    sequelize,
    modelName: "games",
  }
);

module.exports = Game;
