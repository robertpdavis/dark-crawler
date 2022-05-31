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
      // references: {
      //   model: "user",
      //   key: "id",
      // },
    },
    // created: {
    //   timestamps: true,
    // },
    game_status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    game_character_name: {
      type: DataTypes.STRING,
      allowNull: false,
      // references: {
      //   model: "character",
      //   key: "character_name",
      // },
    },
    game_health: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // references: {
      //   model: "character",
      //   key: "character_health",
      // },
    },
    game_strength: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // references: {
      //   model: "character",
      //   key: "character_strength",
      // },
    },
    game_endurance: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // references: {
      //   model: "character",
      //   key: "character_endurance",
      // },
    },
    game_intelligence: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // references: {
      //   model: "character",
      //   key: "character_intelligence",
      // },
    },
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
    modelName: "game",
  }
);

module.exports = Game;
