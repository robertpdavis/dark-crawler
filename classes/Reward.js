const { Reward } = require('../models');

class RewardClass {
    constructor (reward_id, reward_name, reward_description, reward_comment, reward_type, reward_health_points, reward_strength_points, reward_endurance_points, reward_intelligence_points, reward_game_points){
      this.reward_id=reward_id;
      this.reward_name=reward_name;
        this.reward_description= reward_description;
        this.reward_comment = reward_comment;
        this.reward_type = reward_type;
        this.reward_health_points = reward_health_points;
        this.reward_strength_points = reward_strength_points;
        this.reward_endurance_points = reward_endurance_points;
        this.reward_intelligence_points = reward_intelligence_points;
        this.reward_game_points = reward_game_points;
        
    }

    async getAll(){
        try {
            const dbReward = await Reward.findAll({
          
            });
        
            const rewards = dbReward.map((reward) =>
              reward.get({ plain: true })
            );
        
            return rewards;
          } catch (err) {
            console.log(err);
            res.status(500).json(err);
          }
    }

    async getSingle(reward_id){
        try {
          
            const dbReward = await Reward.findByPk(reward_id,{raw: true}); 
        
            if (!dbReward) {
              //res.status(404).json({ message: 'No user with this id!' });
              return;
            }
            
            return dbReward;

          } catch (err) {
            console.log(err);
            return err;
          }
    }

    async getRandomRewardId(){
      try {
        const dbReward = await Reward.findAll({
      
        });
    
        const rewards = dbReward.map((reward) =>
          reward.get({ plain: true })
        );

        let option = Math.floor(Math.random() * rewards.length);
        return rewards[option]["reward_id"];
      }catch(err){
        return err;
      }
    }
}

module.exports= RewardClass;