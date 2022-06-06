const sequelize = require("../config/connection");
const {
  User,
  Character,
  Encounter,
  Game,
  GameEncounter,
  GameItem,
  Inventory,
  Reward,
} = require("../models");

const userData = require("./userData");
const gameData = require("./gameData");
const characterData = require("./characterData");
const encounterData = require("./encounterData");
const gameEncounterData = require("./gameEncounterData");
const gameItemData = require("./gameItemData");
const inventoryData = require("./inventoryData");
const rewardsData = require("./rewardsData");

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });
  const rewards = await Reward.bulkCreate(rewardsData, {
    individualHooks: true,
    returning: true,
  });
  const encounters = await Encounter.bulkCreate(encounterData, {
    individualHooks: true,
    returning: true,
  });
  const characters = await Character.bulkCreate(characterData, {
    individualHooks: true,
    returning: true,
  });
  const games = await Game.bulkCreate(gameData, {
    individualHooks: true,
    returning: true,
  });
  const gameEncounters = await GameEncounter.bulkCreate(gameEncounterData, {
    individualHooks: true,
    returning: true,
  });
  const gameItems = await GameItem.bulkCreate(gameItemData, {
    individualHooks: true,
    returning: true,
  });
  const inventory = await Inventory.bulkCreate(inventoryData, {
    individualHooks: true,
    returning: true,
  });

  process.exit(0);
};

seedDatabase();
