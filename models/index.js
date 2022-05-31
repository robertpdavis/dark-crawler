const User = require("./User");
const Game = require("./Game");
const GameItem = require("./GameItem");
const GameEncounter = require("./GameEncounter");
const Character = require("./Character");
const Encounter = require("./Encounter");
const Inventory = require("./Inventory");
const Rewards = require("./Rewards");

// User.hasOne(Game, {
//   foreignKey: "game_id",
//   onDelete: "CASCADE",
// });

// Game.belongsTo(User, {
//   foreignKey: "id",
// });

// Game.hasMany(GameEncounter, {
//   foreignKey: "game_encounter_id",
//   onDelete: "CASCADE",
// });

// Game.hasMany(GameItem, {
//   foreignKey: "game_item_id",
//   onDelete: "CASCADE",
// });

// Game.hasMany(Encounter, {
//   foreignKey: "game_encounter_id",
//   onDelete: "CASCADE",
// });

// Game.hasMany(Rewards, {
//   foreignKey: "rewards_id",
//   onDelete: "CASCADE",
// });

// Character.belongsTo(User, {
//   foreignKey: "id",
// });

// Inventory.belongsTo(User, {
//   foreignKey: "id",
// });

module.exports = {
  User,
  Game,
  GameItem,
  GameEncounter,
  Character,
  Encounter,
  Inventory,
  Rewards,
};
