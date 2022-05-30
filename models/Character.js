const { UUIDV4, Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Character extends Model {}

Character.init(
  {
    character_id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    character_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 10],
      },
    },
    character_description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    character_health: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 100,
      },
    },
    character_strength: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 100,
      },
    },
    character_endurance: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 100,
      },
    },
    character_Intelligence: {
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
    modelName: "character",
  }
);

module.exports = Character;
