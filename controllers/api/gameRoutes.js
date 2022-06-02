const router = require("express").Router();
const { User, Game } = require("../../models");
const GameHandler = require("../../classes/GameHandler");

router.get("/:option=new", async (req, res) => {
  try {
    const gameFinder = await Game.findOne({
      where: {
        user_id: Game.user_id,
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

router.get("/:option=char?id", async (req, res) => {
  try {
    const newGame = new Game();
  } catch (error) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post("/:option=move", async (req, res) => {
  try {
    const gameHandler = new GameHandler();
    const result = await gameHandler.move(user_id);
    const gameFinder = await Game.findOne({
      where: {
        user_id: Game.user_id,
      },
    });
    if (!gameFinder) {
      res.status(400).json({ message: "No active games found!" });
      res.redirect("/dashboard");
    } else {
      result;
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
