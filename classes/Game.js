// const { User, Character, Encounter, Game, Inventory, Rewards } = require('../models');
const req = require('express/lib/request');
const res = require('express/lib/response');
const { Game , Encounter} = require('../models');
const EncounterClass = require('../classes/Encounter');
const RewardClass = require('../classes/Reward');
const Op = require('sequelize').Op;

class GameClass {
    constructor (game_id, user_id, game_status, character_id, game_health, game_strength, game_endurance, game_Intelligence, game_grid, game_position, game_points){
        this.game_id = game_id;
        this.user_id= user_id;
        this.game_status = game_status;
        this.character_id= character_id;
        this.game_health = game_health;
        this.game_endurance= game_endurance;
        this.game_Intelligence = game_Intelligence;
        this.game_grid=game_grid;
        this.game_position = game_position;
        this.game_points=game_points;
        this.game_strength=game_strength;
    }

    async newGame(){
        try {
            const dbGataData = await Game.create({
            user_id: this.user_id,
            game_status: 'Active',
            character_id: this.character_id,
            game_health: this.game_health,
            game_strength: this.game_strength,
            game_endurance: this.game_endurance,
            game_Intelligence: this.game_Intelligence,
            game_grid: await (this.createGrid()),
            game_position: this.game_position,
            game_points: this.game_points
            },{raw: true});
            
            await this.setValues(dbGataData);
            return  dbGataData;
        }
        catch (err)
        {
            console.log(err)
            return err;
        }
    }

    async checkActiveGame(userId){
        try {
            const dbGame = await Game.findAll({
            where: {
                user_id: userId,
                game_status: {
                    [Op.or]: ['Saved','Active'] 
                }
              },
            },{raw:true});
            
            return dbGame;
          } catch (err) {
            console.log(err);
            return err;
          }
    }

    async retrieveOldGame(){
        try {
            const dbGataData = await Game.findOne({
            where: {
                user_id: this.user_id,
                game_status: 'Active',
                game_id: this.game_id    
            }
            },{raw: true});
          
            if (dbGataData){
                await this.setValues(dbGataData.dataValues);
                return  dbGataData.dataValues;
            }
            else
            {
                return 0;
            }
        }
        catch (err)
        {
            console.log(err)
            return err;
        }
    }

    async setValues(gameData){
        this.game_health=gameData.game_health;
        this.game_strength=gameData.game_strength;
        this.game_endurace=gameData.game_endurace;
        this.game_Intelligence=gameData.game_Intelligence;
        this.game_grid=gameData.game_grid;
        this.game_position=gameData.game_position;
        this.game_points=gameData.game_points;
        this.game_status=gameData.game_status;
    }

    async setNewGameId(newGameId){
        this.game_id=newGameId;
    }
    async updateOldActiveGame()
    {
        try {
            const response = await Game.update({
                game_status: 'Left'
            },{
            where: {
                user_id: this.user_id,
                game_status: {
                    [Op.or]: ['Saved','Active'] 
                }
              },
            });
            
            return;
          } catch (err) {
            console.log(err);
            return err;
          }
    }


    async updateActiveGame()
    {
        try {
            const response = await Game.update({
                game_health: this.game_health,
                game_strength: this.game_strength,
                game_endurace: this.game_endurace,
                game_Intelligence: this.game_Intelligence,
                game_grid: this.game_grid,
                game_status: this.game_status,
                game_points:this.game_points,
            },{
            where: {
                game_id: this.game_id
              },
            });
            
            return;
          } catch (err) {
            console.log(err);
            return err;
          }
    }

    async getEncounter(encounter_id){
        try{
            const encounter = new EncounterClass();
            const encounterData = await encounter.getSingle(encounter_id);

            let oldCharacterGameStrength =this.game_strength;

            //CHANGE GAME STATS HERE
            this.game_strength-=parseInt( encounterData.encounter_strength);
            this.game_health-=parseInt( encounterData.encounter_health);
            this.game_endurance-=parseInt( encounterData.encounter_endurance);
            this.game_Intelligence-=parseInt( encounterData.encounter_intelligence);
            this.game_points-=parseInt(encounterData.encounter_game_points);
            
            
            if (this.game_strength<=0 || this.game_health<=0 || this.game_endurance<=0)
            {
                //character finished game over
                this.game_strength=0;
                this.game_health=0;
                this.game_endurance=0;
                // this.game_Intelligence=0;
                this.game_status="Over"
            }
            
            return encounterData;
        }
        catch (err){
            return err;
        }   
    }

    async getReward(reward_id){
        try{
            console.log("Console log from gerREward function and reward id is ", reward_id)
            const reward = new RewardClass();
            const rewardData = await reward.getSingle(reward_id);

            //Change Game STATS HERE
            this.game_health+=parseInt(rewardData.reward_health);
            this.game_strength+=parseInt(rewardData.reward_strength);
            this.game_endurance+=parseInt(rewardData.reward_endurance);
            this.game_Intelligence+=parseInt(rewardData.reward_intelligence);
            this.game_points+=parseInt(rewardData.reward_game_points)

            return rewardData;
        }
        catch (err){
            console.log(err);
            return err
        }   
    }

    async changeGrid(gridValues){

        let returnValue="";
        this.game_grid[gridValues.oldPlayerRow][gridValues.oldPlayerCol]["type"] ="blank";
        this.game_grid[gridValues.oldPlayerRow][gridValues.oldPlayerCol]["emoji"] ="";
        this.game_grid[gridValues.oldPlayerRow][gridValues.oldPlayerCol]["refId"] ="";
        
        // this.updateActiveGame();
        switch (gridValues.type)
        {
            case "encounter":
                returnValue =await this.getEncounter(gridValues.refId);
                break;

            case "reward":
                console.log("I am in reward hahahah", gridValues.refId);
                
                returnValue =await this.getReward(gridValues.refId);
                
                break;
            default:
                break;
        }

        if(parseInt(this.game_strength)>0)
        {
            this.game_grid[gridValues.playerRow][gridValues.playerCol]["type"] ="player";
            this.game_grid[gridValues.playerRow][gridValues.playerCol]["emoji"] ="🟢";
            this.game_grid[gridValues.playerRow][gridValues.playerCol]["refId"] ="";
        }
        await this.updateActiveGame();
        return returnValue;
    }

    async checkRemainingEncounter(){
        
    }

    async createGrid() {

        const tiles = 30;
        const gridRows = 5;
        const gridCol = tiles/gridRows;
        var grid = [];

        //Get the encounters and rewards from the database
        // const encounterData = await Encounter.findAll();
        // const rewardData  = await Rewards.findAll();
        
        //Clean up responses
        // const encounters = encounterData.map((encounter) => encounter.get({ plain: true }));
        // const rewards = rewardData.map((reward) => reward.get({ plain: true }));

        //Get player starting position
        const playerPos = Math.floor(Math.random() * tiles);

        for (let row = 0; row < gridRows; row++) {

            let cols = [];

            for (let col = 0; col < gridCol; col++) {
                
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
                    
                    cols[col]=obj;
            }

            grid[row] = cols;
        }

        return grid;
    }

}

//test data
encounters = 
[
    {
        encounter_id:1,
        encounter_name: "Enc 1",
        encounter_description: 'Enc 1 description',
        encounter_comment:"You got smashed",
        encounter_health:40,
        encounter_strength:25,
        encounter_endurance:40,
        encounter_intelligence: 20,
        encounter_game_points: -10
    },
    {
        encounter_id:2,
        encounter_name: "Enc 2",
        encounter_description: 'Enc 2 description',
        encounter_comment:"You won",
        encounter_health:10,
        encounter_strength:10,
        encounter_endurance:10,
        encounter_intelligence: 20,
        encounter_game_points: -20
    },
    {
        encounter_id:3,
        encounter_name: "Enc 1",
        encounter_description: 'Enc 1 description',
        encounter_comment:"You got smashed",
        encounter_health:40,
        encounter_strength:25,
        encounter_endurance:40,
        encounter_intelligence: 20,
        encounter_game_points: -10
    }
];

rewards = 
[
    {
        reward_id:1,
        reward_name: "Rew 1",
        reward_description: 'Rew 1 description',
        reward_comment:"Good stuff",
        reward_type:"Weapon",
        reward_health:0,
        reward_strength:30,
        reward_endurance:2,
        reward_intelligence: 0,
        reward_game_points: 10
    },
    {
        reward_id:2,
        reward_name: "Rew 1",
        reward_description: 'Rew 1 description',
        reward_comment:"Good stuff",
        reward_type:"Weapon",
        reward_health:0,
        reward_strength:30,
        reward_endurance:2,
        reward_intelligence: 0,
        reward_game_points: 10
    },
    {
        reward_id:3,
        reward_name: "Rew 3",
        reward_description: 'Rew 3 description',
        reward_comment:"Good stuff",
        reward_type:"Weapon",
        reward_health:0,
        reward_strength:30,
        reward_endurance:2,
        reward_intelligence: 0,
        reward_game_points: 10
    }
];

module.exports = GameClass;