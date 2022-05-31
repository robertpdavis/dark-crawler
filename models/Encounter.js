const { Model, DataTypes } = require("sequelize");

const sequelize = require("../config/connection.js");

class Encounter extends Model {}

Encounter.init(
  {
    encounter_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    encounter_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    encounter_description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    encounter_comment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    encounter_health: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 100,
      },
    },
    encounter_strength: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 100,
      },
    },
    encounter_endurance: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 100,
      },
    },
    encounter_intelligence: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 100,
      },
    },
    encounter_game_points: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 100,
      },
    },
  },
  {
    sequelize,
    modelName: "encounters",
  }
);

module.exports = Encounter;
