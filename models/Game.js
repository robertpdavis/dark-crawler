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
    game_status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    character_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "characters",
        key: "character_id",
      },
    },
    game_health: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 500,
      },
    },
    game_strength: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 100,
      },
    },
    game_endurance: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 100,
      },
    },
    game_Intelligence: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 100,
      },
    },
    //Details of game grid in json string
    game_grid: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    //Current player position - json string {x,y}
    game_position: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    game_points: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    //Include createdAt and updatedAt
    timestamps: true,
    modelName: "games",
  }
);

module.exports = Game;
