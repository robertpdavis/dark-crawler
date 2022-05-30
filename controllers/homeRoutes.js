const router = require('express').Router();
const { User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
    try {
        res.render('homepage', { layout: 'home' });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/dashboard', withAuth, async (req, res) => {
    res.render('game-grid', { loggedIn: req.session.loggedIn, title: 'Dashboard', layout: 'dashboard' });
});

router.get('/login', (req, res) => {
    // If the user is already logged in, redirect the request to the user dashboard
    
  if (req.session.logged_in) {
    res.render('all', { title: 'Dashboard Main', layout: 'dashboard' });
    return;
  }

  res.render('login', { title: 'Login', layout: 'dashboard' });
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
          .json({ message: 'Incorrect email or password. Please try again!' });
        return;
      }
  
      const validPassword = await dbUserData.checkPassword(req.body.password);
  
      if (!validPassword) {
        res
          .status(400)
          .json({ message: 'Incorrect email or password. Please try again!' });
        return;
      }
  
      req.session.save(() => {
        req.session.loggedIn = true;
  
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

    res.render('signup', { title: 'SignUp', layout: 'dashboard' });
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
        
        //sendMailit('New', dbUserData);
        
        req.session.save(() => {
        req.session.loggedIn = true;
        res
            .status(200)
            .json({ user: dbUserData, message: 'You are now logged in!' });
        
        });
    } catch (err) {
        res.status(500).json(err);
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
module.exports = router;