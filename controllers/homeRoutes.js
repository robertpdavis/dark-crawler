const router = require('express').Router();
const { User } = require('../models');
const withAuth = require('../utils/auth');
const sendMail = require('../utils/email');
const randToken = require('rand-token');
const GameClass = require('../classes/Game');
const CharacterClass = require('../classes/Character');
const EncounterClass = require('../classes/Encounter');
const { render } = require('express/lib/response');
const { contentDisposition } = require('express/lib/utils');
const character = new CharacterClass;
const game = new GameClass;

router.get('/', async (req, res) => {
    try {
        res.render('homepage', { layout: 'home' });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/dashboard', withAuth, async (req, res) => {

    const savedGameData= await checkSavedGame(req.session.userId);
    if (savedGameData!=0)
    {
      const gameData = savedGameData[0].dataValues;
      console.log("GameData",gameData);
      res.render('dashboard', { gameData, userFullname:req.session.fullName, loggedIn: req.session.loggedIn, title: 'Dashboard', layout: 'main' });
    }
    else
    {
      res.render('dashboard', {loggedIn: req.session.loggedIn, userFullname:req.session.fullName, title: 'Dashboard', layout: 'main' });
    }
});

router.get('/game', withAuth, async (req, res) => {
  const menu = 
  {
      label1:'Save Game',
      href1:'/dashboard',
      label2: 'Finish Game',
      href2:'#'
  }
  // const game = new GameClass;
  game.user_id=req.session.userId;
    //TO KEEP ONLY SINGLE GAME ACTIVE IN DB, LETS DELETE ANY OLD ACTIVE GAME AND CREATE NEW GAME
  await game.updateOldActiveGame();
  req.session.save(() => {
    req.session.gameId="";
  })
  const characters = await character.getAll();
  
  res.render('characters', {characters, loggedIn: req.session.loggedIn, title: 'Characters', layout: 'main' });
});

router.post('/gamestart', withAuth, async (req, res) => {
  
  try{
      
    // console.log("Selected character", req.body.selectedCharacter);
    req.session.save(()=>{
      req.session.characterId = req.body.selectedCharacter;
      res.status(200).json({message: "Game Starting"});
    });
    
  }
  catch (err){
    res.status(404).json({title:"Error", message: err});
  }
});

//RENDERING NEW GAME
router.get('/gamestart', withAuth, async (req, res) => {
  const menu = 
    {
        label1:'Save Game',
        href1:'/dashboard',
        label2: 'Finish Game',
        href2:'#'
    }

    if (req.session.gameId)
    {
      res.redirect('/gamestart/' + req.session.gameId)
      return;
    }
    
    //GET CHARACTER DETAILS FROM CHARACTERS TABLE
    const gameCharacter = await character.getSingle(req.session.characterId);
    //CREATE NEW GAME IN DB AND SAVE ALL THE INITIAL DATA (user_id, characterdetails) -- use gameid, characterid in cookies
    if(gameCharacter)
    {
      // const game = new GameClass;
      game.user_id=req.session.userId;
      //TO KEEP ONLY SINGLE GAME ACTIVE IN DB, LETS DELETE ANY OLD ACTIVE GAME AND CREATE NEW GAME
      await game.updateOldActiveGame();
      //--------
      game.character_id=req.session.characterId;
      game.game_health=gameCharacter.character_health;
      game.game_strength=gameCharacter.character_strength;
      game.game_endurance=gameCharacter.character_endurance;
      game.game_Intelligence=gameCharacter.character_Intelligence;
      game.game_position="5,0";
      game.game_points=0;
      const newGame= await game.newGame();
      const gameData=newGame.dataValues;
      
      req.session.save(async ()=>{
        game.setNewGameId(gameData.game_id);
        req.session.gameId=await gameData.game_id;
        req.session.moves=0;
      })
    res.render('game', { menu, gameData, gameCharacter, loggedIn: req.session.loggedIn, title: 'Game Grid', layout: 'main' });
    }else{
      res.status(404).json({message: "Unable to create game", title:"Game Error"});
      return;
    }
})

//RENDERING SAVED GAME
router.get('/gamestart/:game_id', withAuth, async (req, res) => {
  const menu = 
    {
        label1:'Save Game',
        href1:'/dashboard',
        label2: 'Finish Game',
        href2:'#'
    }

    //IF GAME EXISTS IN DB THNE RENDER PAGE
    
    // const game = new GameClass;
    game.user_id=req.session.userId;
    game.game_id=req.params.game_id;
    
    const gameData= await game.retrieveOldGame();
    // console.log("gameDAta",gameData)
    if (gameData!=0)
    { req.session.save(()=>{
      req.session.characterId=gameData.character_id;
      req.session.gameId=gameData.game_id;
    });

    const gameCharacter = await character.getSingle( gameData.character_id)
    
    res.render('game', { menu, gameData, gameCharacter, gameMoves: req.session.moves,  loggedIn: req.session.loggedIn, title: 'Game Grid', layout: 'main' });
    }
    else
    {
      req.session.save(()=>{
        req.session.gameId=null;
        req.session.characterId=null;
        req.session.moves=0;
      })
      res.render('dashboard', { loggedIn: req.session.loggedIn, userFullname:req.session.fullName, title: 'Dashboard', layout: 'main' });
    }
})

//RENDerING MOVES
router.post('/gamestart/:row/:col', withAuth, async (req, res) => {
  let actionDetails="";
  try{
    
      actionDetails = await game.changeGrid(req.body)
      req.session.moves++;
      res.status(200).json({message: "Updated", gameMoves: req.session.moves, returnValue: actionDetails, game_id: req.session.gameId, game_status: game.game_status});  
    }
  catch(err){
   
    res.status(500).json(err);
  }
})

router.get('/login', (req, res) => {
    // If the user is already logged in, redirect the request to the user dashboard
    
  if (req.session.loggedIn) {
    res.redirect('/dashboard');
    return;
  }

  res.render('login', { title: 'Login', layout: 'main' });
});
  
//GET SIGN UP PAGE TO CREATE NEW USER
router.get('/signup', (req, res) => {
    // If the user is already logged in, redirect the request to the user dashboard
    if (req.session.loggedIn) {
        res.redirect('/dashboard');
        return;
    }

    res.render('signup', { title: 'SignUp', layout: 'main' });
});

//RESET PASSWORD GET ROUTE
router.get('/reset', (req, res) => {
    res.render('passwordreset', { title: 'Reset Password', layout: 'main' });
});
 
// ROUTE FOR PAGE TO CHANGE PASSWORD WITH SECURITY CODE
router.get('/resetpass', async (req, res) => {
  res.render('passwordresetfinal', { title: 'Reset Password', layout: 'main' });
});

const checkSavedGame = async(user_id) =>{
  const gClass= new GameClass;
  const gameData=await gClass.checkActiveGame(user_id);

    if (gameData.length !=0)
    {
      return gameData;
    }
    else{
      return 0;
    }
}

module.exports = router;