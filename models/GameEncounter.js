const { UUIDV4, Model, DataTypes } = require("sequelize");

const sequelize = require("../config/connection.js");

class GameEncounter extends Model {}

GameEncounter.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
    },
    game_id: {
      references: {
        model: "game",
        key: "game_id",
      },
    },
    encounter_id: {
      references: {
        model: "encounter",
        key: "encounter_id",
      },
    },
  },
  {
    sequelize,
    modelName: "gameEncounter",
  }
);

module.exports = GameEncounter;
