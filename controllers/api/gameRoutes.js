const router = require('express').Router();
const { User } = require('../../models');
const GameHandler = require('../../classes/GameHandler');


router.post('/', async (req, res) => {
  try {
    const gameHandler = new GameHandler;
    const result = await gameHandler.move(1);


      res.status(200).json("");
 
  } catch (err) {
    res.status(400).json(err);
  }
});


module.exports = router;