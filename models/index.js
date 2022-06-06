const User = require("./User");
const Game = require("./Game");
const Reward = require("./Rewards");
const GameItem = require("./GameItem");
const Encounter = require("./Encounter");
const GameEncounter = require("./GameEncounter");
const Inventory = require("./Inventory");
const Character = require("./Character");

User.hasMany(Game, {
  foreignKey: "game_id",
  onDelete: "CASCADE",
});

Game.belongsTo(User, {
  foreignKey: "id",
});

Game.hasOne(Character, {
  foreignKey: "game_id",
});

Game.hasMany(GameEncounter, {
  foreignKey: "game_id",
  onDelete: "CASCADE",
});

Game.hasMany(GameItem, {
  foreignKey: "game_id",
  onDelete: "CASCADE",
});

Game.hasMany(Encounter, {
  foreignKey: "game_id",
  onDelete: "CASCADE",
});

Game.hasMany(Reward, {
  foreignKey: "game_id",
  onDelete: "CASCADE",
});

Character.belongsTo(Game, {
  foreignKey: "game_id",
});

Character.hasOne(Inventory, {
  foreignKey: "inventory_id",
});

Inventory.belongsTo(Character, {
  foreignKey: "inventory_id",
});

module.exports = {
  User,
  Game,
  GameItem,
  GameEncounter,
  Character,
  Encounter,
  Inventory,
  Reward,
};
