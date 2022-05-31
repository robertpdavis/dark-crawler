const { UUIDV4, Model, DataTypes } = require("sequelize");

const sequelize = require("../config/connection.js");

class GameItem extends Model {}

GameItem.init(
  {
    game_item_id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    game_id: {
      references: {
        model: "game",
        key: "game_id",
      },
    },
    item_id: {
      references: {
        model: "reward",
        key: "reward_id",
      },
    },
  },
  {
    sequelize,
    modelName: "gameItem",
  }
);

module.exports = GameItem;
