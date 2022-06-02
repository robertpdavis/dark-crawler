const { UUIDV4, Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Character extends Model {}

Character.init(
  {
    character_id: {
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
    inventory_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "inventories",
        key: "inventory_id",
      },
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
    timestamps: false,
    modelName: "characters",
  }
);

module.exports = Character;
