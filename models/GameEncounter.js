const { UUIDV4, Model, DataTypes } = require("sequelize");

const sequelize = require("../config/connection.js");

class GameEncounter extends Model {}

GameEncounter.init(
  {
    game_encounter_id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    game_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "games",
        key: "game_id",
      },
    },
    encounter_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "encounters",
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
