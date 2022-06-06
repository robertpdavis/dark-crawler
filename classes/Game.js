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
                game_endurance: this.game_endurance,
                game_Intelligence: this.game_Intelligence,
                game_grid: this.game_grid,
                game_status: this.game_status,
                game_points:this.game_points,
            },{
            where: {
                game_id: this.game_id
              },
            });
            console.log("GAME UPDATING VALUES: ", response);  
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

            //CHANGE GAME STATS HERE
            this.game_strength-=parseInt( encounterData.encounter_strength);
            this.game_health-=parseInt( encounterData.encounter_health);
            this.game_endurance-=parseInt( encounterData.encounter_endurance);
            this.game_Intelligence-=parseInt( encounterData.encounter_intelligence);
            this.game_points-=parseInt(encounterData.encounter_game_points);
            
            
            if (this.game_strength<=0 || this.game_health<=0 || this.game_endurance<=0 || this.game_Intelligence<=0)
            {
                //character finished game over
                this.game_strength=0;
                this.game_health=0;
                this.game_endurance=0;
                this.game_Intelligence=0;
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

            //Setting GAME STATS to 100 if it exceeds after getting any reward
            if (this.game_strength>100)
            {
                //character finished game over
                this.game_strength=100;
                this.game_status="Active";
            }
            if (this.game_health>100)
            {
                this.game_health=100;
                this.game_status="Active";
            }
            if(this.game_Intelligence>100)
            {
                this.game_Intelligence=100;
                this.game_status="Active";
            }
            if(this.game_endurance>100)
            {
                this.game_endurance=100;
                this.game_status="Active";
            }


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
        await this.checkRemainingEncounter();
        await this.updateActiveGame();
        return returnValue;
    }

    async checkRemainingEncounter(){
        let gameChkEncounters=0;
        for (let row=0; row < this.game_grid.length; row++)
        {
            for (let col=0; col<this.game_grid[row].length; col++)
            { 
                if (this.game_grid[row][col]["type"]==="encounter")
                    {
                        gameChkEncounters++
                        this.game_status="Active"
                        return gameChkEncounters;
                    }
            }
        }
        this.game_status="Finish"
        return gameChkEncounters;
    }

    async createGrid() {

        const tiles = 30;
        const gridRows = 5;
        const gridCol = tiles/gridRows;
        var grid = [];
        const randEncounter= new EncounterClass();
        const randReward = new RewardClass();

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
                            //let selection = Math.floor(Math.random() * encounters.length);
                            let selection = await randEncounter.getRandomEncounterId();
                            
                            obj.type = 'encounter';
                            obj.refId= selection;
                            obj.emoji='⚔️';
                        } else {
                            // let selection = Math.floor(Math.random() * rewards.length);
                            let selection = await randReward.getRandomRewardId();
                            obj.type = 'reward';
                            obj.refId= selection;
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

module.exports = GameClass;