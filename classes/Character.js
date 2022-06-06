const { Character, Game} = require('../models');

class CharacterClass {
    constructor(character_id, character_name, character_description, character_health, character_strength, character_endurance, character_intelligence) {
        this.character_id = character_id;
        this.character_name = character_name;
        this.character_description = character_description;
        this.character_health = character_health;
        this.character_strength = character_strength;
        this.character_endurance = character_endurance;
        this.character_intelligence=character_intelligence
    }

    async getAll(){
        try {
            const dbCharacters = await Character.findAll({
          
            });
        
            const characters = dbCharacters.map((character) =>
              character.get({ plain: true })
            );
        
            return characters;
          } catch (err) {
            console.log(err);
            res.status(500).json(err);
          }
    }

    async getSingle(character_id){
        try {
            const dbCharacter = await Character.findByPk(character_id,{raw: true}); 
        
            if (!dbCharacter) {
              //res.status(404).json({ message: 'No user with this id!' });
              return;
            }
            
            return dbCharacter;

          } catch (err) {
            console.log(err);
            return err;
          }
    }
}

module.exports = CharacterClass;