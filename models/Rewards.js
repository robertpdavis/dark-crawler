const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Reward extends Model {}

Reward.init(
  {
    reward_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    reward_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reward_description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reward_comment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reward_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reward_health: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 100,
      },
    },
    reward_strength: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 100,
      },
    },
    reward_endurance: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 100,
      },
    },
    reward_intelligence: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 100,
      },
    },
    reward_game_points: {
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
    modelName: "rewards",
  }
);

module.exports = Reward;
