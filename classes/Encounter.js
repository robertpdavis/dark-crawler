const { Encounter} = require('../models');

class EncounterClass {
    constructor (encounter_id, encounter_name, encounter_description, encounter_comment, encounter_health, encoutner_strength, encounter_endurance, encounter_intelligence, encounter_game_points){
        this.encounter_id=encounter_id,
        this.encounter_name=encounter_name,
        this.encounter_description=encounter_description, 
        this.encounter_comment=encounter_comment, 
        this.encounter_health=encounter_health, 
        this.encoutner_strength=encoutner_strength, 
        this.encounter_endurance=encounter_endurance, 
        this.encounter_intelligence=encounter_intelligence, 
        this.encounter_game_points=encounter_game_points
    }

    async getAll(){
        try {
            const dbEncounter = await Encounter.findAll({
          
            });
        
            const encounters = dbEncounter.map((encounter) =>
              encounter.get({ plain: true })
            );
        
            return encounters;
          } catch (err) {
            console.log(err);
            res.status(500).json(err);
          }
    }

    async getSingle(encounter_id){
        try {
          console.log("Encouter id" , encounter_id)
            const dbEncounter = await Encounter.findByPk(encounter_id,{raw: true}); 
        
            if (!dbEncounter) {
              //res.status(404).json({ message: 'No user with this id!' });
              return;
            }
            // console.log("single encouter result", dbEncounter);
            return dbEncounter;

          } catch (err) {
            console.log(err);
            return err;
          }
    }

    async getRandomEncounterId(){
      try {
        const dbEncounter = await Encounter.findAll({
      
        });
    
        const encounters = dbEncounter.map((encounter) =>
          encounter.get({ plain: true })
        );

        let option = Math.floor(Math.random() * encounters.length);
        return encounters[option]["encounter_id"];
      }catch(err){
        return err;
      }
    }
}

module.exports= EncounterClass;