const router = require('express').Router();
const { User, Game } = require('../models');
const withAuth = require('../utils/auth');
const sendMail = require('../utils/email');
const randToken = require('rand-token');
const GameHandler = require('../classes/GameHandler');

router.get('/', async (req, res) => {
    try {
        res.render('homepage', { layout: 'home' });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/dashboard', withAuth, async (req, res) => {
    //To do
    try {
      const userData = await User.findByPk(req.session.user_id, {
        attributes: { exclude: ['password'] },
      });

      const user = userData.get({ plain: true });

      const menu = 
      {
        label1:'Option 1',
        href1:'#',
        label2: 'Option 2',
        href2:'#'
      }

      res.render('dashboard', {
        ...user,
        menu,
        loggedIn: req.session.loggedIn,
        title: 'Dashboard',
        layout: 'main'
      });
    } catch (err) {
      res.status(500).json(err);
    }
});

router.get('/game', withAuth, async (req, res) => {

  try {
  const menu = 
  {
      label1:'xxx',
      href1:'#',
      label2: 'Finish Game',
      href2:'#'
  };
  //Get active game data
 
  const gameData = await Game.findOne({
     where: { 
        user_id: req.session.user_id,
        game_status: 'active',
      },
  });

  const game = gameData.get({ plain: true });
  const grid = JSON.parse(game.game_grid);

  res.render('game', { menu, game, grid, loggedIn: req.session.loggedIn, title: 'Game Board', layout: 'main' });

} catch (err){
    //No active games for user or other error, redirect to dashboard
    console.log(err);
    res.redirect('/dashboard');
    return;
}
});

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

// ROUTE FOR PAGE TO CHANGE PASSWORD WITH SECURITY CODE
router.get('/resetpass', async (req, res) => {
  res.render('passwordresetfinal', { title: 'Reset Password', layout: 'main' });
});

//RESET PASSWORD GET ROUTE
router.get('/reset', (req, res) => {
  res.render('passwordreset', { title: 'Reset Password', layout: 'main' });
});

module.exports = router;