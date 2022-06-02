const { vary } = require('express/lib/response');
const { User, Character, Encounter, Game, Inventory, Rewards } = require('../models');

class GameHandler {

    constructor() {
        //Set up so grid size could change e.g. enhancement
        this.tiles = 30;
        this.gridRows = 5;
        this.gridCols = this.tiles/this.gridRows;
    }


    async newGame(user_id,char_id){
        //Get game grid
        const grid = await this.createGrid();
        //Get selected character
        const characterData = await Character.findByPk(char_id);
        const character = characterData.get({ plain: true });
        
        //Create the new game
        const newGame = await Game.create({
            user_id: user_id,
            game_status: 'active',
            character_id: char_id,
            game_health: character.character_health,
            game_strength: character.character_strength,
            game_endurance: character.character_endurance,
            game_Intelligence: character.character_Intelligence,
            game_grid: JSON.stringify(grid),
            game_position: '',
            game_points:0
        })

        return newGame;
    }

    async move(game_id){

        if (!game_id){return};

        //Get the game object
        const gameData = await Game.findByPk(game_id);
        const game = gameData.get({ plain: true });
        //Get the game grid
        const grid = JSON.parse(game.game_grid);
        //Get the players current pos
        const playerPos = await this.getPlayerPos(grid);
        //Get the players last pos
        let lastPos = game.game_position;
        //Get randow direction 1=up, 2=down, 3=left, 4=right
        const direction = Math.floor(Math.random() * 4);
        let newPos = [];
        newPos[0] = playerPos[0];
        newPos[1] = playerPos[1];
        let move = false;


        while (move != true) {
            //Get randow direction 1=up, 2=down, 3=left, 4=right
            const direction = Math.floor(Math.random() * 4);

            switch (direction) {
                case 1:
                    --newPos[0];                
                    break;
                case 2:
                    ++newPos[0];                
                    break;
                case 3:
                    --newPos[1];                
                    break;
                case 3:
                    --newPos[1];                
                    break;
                default:
                    break;
            }        
            //If there was a last pos
            if (lastPos != ''){
                //Make sure the newPos and lastPos are not equal i.e. go back on itself
                if ((lastPos[0] != newPos[0] || lastPos[1] != newPos[1])) {
                    //check newPos is within the grid
                    if (newPos[0] > 0 && newPos[1] > 0 && newPos[0] < this.gridCols && newPos[1] < this.gridRows) {
                        move = true;
                    }
                }     
            }else{//check newPos is within the grid

                if (newPos[0] >= 0 && newPos[1] >= 0 && newPos[0] < this.gridCols && newPos[1] < this.gridRows) {
                    move = true;
                }
            }
        }
        //move made set last pos 
        lastPos = playerPos;

        //See if there is currently an encounter or reward in the new pos
        let encounter;
        let reward;
        const action = grid[newPos[0]][newPos[1]]['type'];
        //If encounter
        if (action === 'encounter') {
            const encounter = await this.getEncounter(grid[newPos[0]][newPos[1]]['refId']);
            //TO DO all encounter calcs

            let health = '';
            let strength = '';
            let endurance = '';
            let intelligence = '';
            // let points = game.game_points + or - x;
        };

        if (action === 'reward') {
            const reward = await this.getReward(grid[newPos[0]][newPos[1]]['refId']);
            //TO DO all reward calcs
            
            let health = '';
            let strength = '';
            let endurance = '';
            let intelligence = '';
            // let points = game.game_points + or - x;
        }
        //Put player in newPos
        let obj ={};
        obj.type = 'player';
        obj.refId= '';
        obj.emoji= '🟢';
        grid[newPos[0]][newPos[1]]=obj;

        //Clear player from old pos
        obj.type = 'blanc';
        obj.refId= '';
        obj.emoji= '';
        grid[playerPos[0]][playerPos[1]]=obj;

        //Update game
        Game.update(
            {
            //   game_health: health,
            //   game_strength: strength,
            //   game_endurance: endurance,
            //   game_Intelligence: intelligence,
              game_grid: JSON.stringify(grid),
              game_postion: playerPos,
            //   game_points: points,
              
            },
            {
              // Gets a book based on the book_id given in the request parameters
              where: {
                game_id: game_id,
              },
            }
          )

        const updatedGameData = await Game.findByPk(game_id);
        const updatedGame = updatedGameData.get({ plain: true });

        //Add encounter or reward object to game object for client end stuff
        if (encounter){updatedGame.encounter = encounter};
        if (reward){updatedGame.reward = reward};

        return updatedGame;
        
    }

    async getEncounter(encounter_id){
        const encounterData = await Encounter.findByPk(encounter_id);
        const encounter = encounterData.get({ plain: true });
        return encounter;
    }

    async getReward(reward_id){
        const rewardData = await Rewards.findByPk(reward_id);
        const reward = rewardData.get({ plain: true });
        return reward;
    } 

    async createGrid() {
        var grid = [];

        //Get the encounters and rewards from the database
        const encounterData = await Encounter.findAll();
        const rewardData  = await Rewards.findAll();
        
        //Clean up responses
        const encounters = encounterData.map((encounter) => encounter.get({ plain: true }));
        const rewards = rewardData.map((reward) => reward.get({ plain: true }));

        //Get player starting position
        const playerPos = Math.floor(Math.random() * this.tiles);

        for (let row = 0; row < this.gridRows; row++) {

            let cols = [];

            for (let col = 0; col < this.gridCols; col++) {
                
                let obj = {};

                if (playerPos === (row * 6 + col + 1)) {
                    obj.type = 'player';
                    obj.refId= '';
                    obj.emoji= '🟢';
                }else{
                    //Randomly get an encounter/reward or blank tile
                    let option = Math.floor(Math.random() * 2);
                    //Get encounter or reward
                    if (option === 1) {

                        let subOption = Math.floor(Math.random() * 2);
                        if (subOption === 1) {
                            let selection = Math.floor(Math.random() * encounters.length);
                            obj.type = 'encounter';
                            obj.refId=encounters[selection].encounter_id;
                            obj.emoji='⚔️';
                        } else {
                            let selection = Math.floor(Math.random() * rewards.length);
                            obj.type = 'reward';
                            obj.refId= rewards[selection].reward_id;
                            obj.emoji= '💰';
                        }

                    //Get blank
                    } else {
                        obj.type = 'blank';
                        obj.refId= '';
                        obj.emoji= '';
                    }
                }
                    
                    cols[col] = obj;
            }

            grid[row] = cols;
        }

        return grid;
    }

    //Gets the palyer postion in the grid
    async getPlayerPos(grid) {
        let rows = grid.length;
        for (let row = 0; row < rows; row++) {
            let cols = grid[row].length
            for (let col = 0; col < cols; col++) {
                if (grid[row][col]['type'] === 'player') {
                    return [row,col];
                }
            }
        }
    }
}


module.exports = GameHandler;