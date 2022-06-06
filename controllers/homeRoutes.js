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
    //To do
    const menu = 
    {
      label1:'Option 1',
      href1:'#',
      label2: 'Option 2',
      href2:'#'
    }

    const savedGameData= await checkSavedGame(req.session.userId);
    if (savedGameData!=0)
    {
      const gameData = savedGameData[0].dataValues;
      console.log("GameData",gameData);
      res.render('dashboard', { menu, gameData, userFullname:req.session.fullName, loggedIn: req.session.loggedIn, title: 'Dashboard', layout: 'main' });
    }
    else
    {

      res.render('dashboard', {menu, loggedIn: req.session.loggedIn, userFullname:req.session.fullName, title: 'Dashboard', layout: 'main' });
    }

    
});

router.get('/game', withAuth, async (req, res) => {
  const menu = 
  {
      label1:'Save Game',
      href1:'#',
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
  
  res.render('characters', { menu, characters, loggedIn: req.session.loggedIn, title: 'Characters', layout: 'main' });
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
        href1:'#',
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
        href1:'#',
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
    
    res.render('game', { menu, gameData, gameCharacter, loggedIn: req.session.loggedIn, title: 'Game Grid', layout: 'main' });
    }
    else
    {
      res.render('dashboard', {menu, loggedIn: req.session.loggedIn, userFullname:req.session.fullName, title: 'Dashboard', layout: 'main' });
    }
})



//RENDerING MOVES
router.post('/gamestart/:row/:col', withAuth, async (req, res) => {
  let actionDetails="";
  try{
    // if (req.body.type==="encounter")
    // {
    //   console.log("I am in encouter if statement")
    //   const encounters= new EncounterClass();
    //   actionDetails = await encounters.getSingle(req.body.refId);
    // }
      console.log(req.body)
      actionDetails = await game.changeGrid(req.body)

       console.log(actionDetails);
      res.status(200).json({message: "Updated", returnValue: actionDetails, game_id: req.session.gameId, game_status: game.game_status});  
    }
  catch(err){
   
    res.status(500).json(err);
  }
})


router.get('/login', (req, res) => {
    // If the user is already logged in, redirect the request to the user dashboard
    
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }

  res.render('login', { title: 'Login', layout: 'main' });
});

//LOGIN CHECKING ROUTE
router.post('/login', async (req, res) => {
    try {
      const dbUserData = await User.findOne({
        where: {
          email: req.body.email,
        },
      });
  
      if (!dbUserData) {
        res
          .status(400)
          .json({ message: 'Incorrect email or password. Please try again!' , title: 'Incorrect Details'});
        return;
      }
  
      const validPassword = await dbUserData.checkPassword(req.body.password);
  
      if (!validPassword) {
        res
          .status(400)
          .json({ message: 'Incorrect email or password. Please try again!' , title: 'Incorrect Details'});
        return;
      }
  
      req.session.save(() => {
        req.session.loggedIn = true;
        req.session.userId =dbUserData.id;
        req.session.fullName =dbUserData.fullname,
        res
          .status(200)
          .json({ user: dbUserData, message: 'You are now logged in!' });
      });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });
  
//GET SIGN UP PAGE TO CREATE NEW USER
router.get('/signup', (req, res) => {
    // If the user is already logged in, redirect the request to the user dashboard
    if (req.session.logged_in) {
        res.redirect('/dashboard');
        return;
    }

    res.render('signup', { title: 'SignUp', layout: 'main' });
});

//POST REQUEST - CREATE AND ADD IN DB
router.post('/signup', async (req, res) => {
    try {
        const dbUserData = await User.create({
        fullname: req.body.fullname,
        email: req.body.email,
        password: req.body.password,
        });

        //run nodemail code here to send welcome email
        sendMail('New', dbUserData);
        
        req.session.save(() => {
        req.session.loggedIn = true;
        req.session.fullName =req.body.fullname,
        req.session.userId=dbUserData.dataValues.id;
        res
            .status(200)
            .json({ user: dbUserData, message: 'You are now logged in!' });
        
        });
    } catch (err) {
        res.status(500).json(err);
    }
});


//RESET PASSWORD GET ROUTE
router.get('/reset', (req, res) => {
    res.render('passwordreset', { title: 'Reset Password', layout: 'main' });
});


//PASSWORD RESET ROUTE - Sending Security code to email.
router.put('/reset', async (req, res) => {
    
    try {
        
        let token =  randToken.generate(6);
            const reset = await User.update({password_reset_code: token}, {
                where: { email: req.body.email }
            });
      
        if (reset) {
          const args = {
            email: req.body.email,
            code : token
          }
          
            sendMail('Reset', args);
            req.session.resettries=3;
            res.status(200).json({message:"Password reset email sent."});
        }
        else
        {
        res.status(400).json({message:"no category matched for updating."});
        }

    }
    catch (err){
        res.status(500).json({message: "run into error, try again later."})
    }
});
 
// ROUTE FOR PAGE TO CHANGE PASSWORD WITH SECURITY CODE
router.get('/resetpass', async (req, res) => {
  res.render('passwordresetfinal', { title: 'Reset Password', layout: 'main' });
});

//ROUTE TO UPDATE/CHANGE NEW PASSWORD IF SECURITY CODE MATCHES
router.put('/resetpass', async (req, res) => {
  try {
      
      const reset = await User.findOne({
          where: {
          email: req.body.email
          },
      });

      if (!reset)
      {
        res.status(404).json({message: "Invalid Email"});
        return;
      }
      
      if (reset.password_reset_code!== req.body.resetcode)
      { 
        if (req.session.resettries===0)
        {
          //delete that code from db and redirect to homepage or other landing page
          const reset = await User.update({password_reset_code: null}, {
            where: { email: req.body.email }
          });
          res.status(404).json({message: "Invalid Code - 3 attempts done.", tries: req.session.resettries});  
          return;
        }
        if (!req.session.resettries)
        {
          req.session.resettries=3;
        }
        req.session.resettries--;
        res.status(404).json({message: "Invalid Code", tries: req.session.resettries});
        return;
      }
      const resetDone = await User.update({password_reset_code: null, password: req.body.password}, {
        where: { email: req.body.email },
        individualHooks: true
      });
      res.status(200).json({message:"Password changed email sent updated.", stutus:"Done"});
  }
  catch (err){
      res.status(500).json({message: "run into error, try again later."})
  }
});

router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
        res.status(204).end();
        });
        res.redirect('/');
    } else {
        res.status(404).end();
    }
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