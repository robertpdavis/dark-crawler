const router = require("express").Router();
const { User, Game } = require("../../models");
const GameHandler = require("../../classes/GameHandler");

router.get("/new", async (req, res) => {
  try {
    console.log("here");
    const gameFinder = await Game.findOne({
      where: {
        user_id: req.session.user_id,
      },
    });
    if (!gameFinder) {
      res
        .status(200)
        .render(
          "characterSelect",
          json({ message: "Character select screen here" })
        );
    } else {
      res.json({ message: "Active game already found" });
      return;
    }
  } catch (error) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/char?id", async (req, res) => {
  try {
    const gameHandler = new GameHandler();
    const newGame = await gameHandler.newGame(req.session.user_id, character_id);

    res.redirect("/game");
  } catch (error) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post("/move", async (req, res) => {
  try {
    const gameHandler = new GameHandler();
    const menu = 
    {
        label1:'xxx',
        href1:'#',
        label2: 'Finish Game',
        href2:'#'
    };

    const gameFinder = await Game.findOne({
      where: {
        user_id: req.session.user_id,
      },
    });

    if (gameFinder) {

      const game = await gameHandler.move(gameFinder.game_id);
      const grid = JSON.parse(game.game_grid);
      

      res.render('game', { menu, game, grid, loggedIn: req.session.loggedIn, title: 'Game Board', layout: 'main' });

    } else {
      res.status(400).json({ message: "No game found" });
      return;
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete("/finish", async (req, res) => {
  try {
  } catch (error) {
    console.log(err);
    res.status(500).json(err);
  }
});


module.exports = router;
