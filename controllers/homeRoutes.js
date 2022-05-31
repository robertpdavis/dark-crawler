const router = require('express').Router();
const { User } = require('../models');
const withAuth = require('../utils/auth');
const sendMailit = require('../utils/email');

router.get('/', async (req, res) => {
    try {
        res.render('homepage', { layout: 'home' });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/dashboard', async (req, res) => {
    try {

        res.render('dashboard', {

            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/game', async (req, res) => {
    try {


        //grid array test example - consists of 5 arrays of 6 objects (columns)
        const grid = [];
        grid[0] =
            [
                {
                    type: 'encounter',
                    refId: '1',
                    emoji: '⚔️'
                },
                {
                    type: 'encounter',
                    refId: '2',
                    emoji: '⚔️',
                },
                {
                    type: 'blank',
                    refId: '',
                    emoji: '',
                },
                {
                    type: 'reward',
                    refId: '1',
                    emoji: '💰'
                },
                {
                    type: 'reward',
                    refId: '1',
                    emoji: '💰'
                },
                {
                    type: 'blank',
                    refId: '',
                    emoji: '',
                }
            ];
        grid[1] =
            [
                {
                    type: 'encounter',
                    refId: '1',
                    emoji: '⚔️'
                },
                {
                    type: 'encounter',
                    refId: '2',
                    emoji: '⚔️',
                },
                {
                    type: 'user',
                    refId: '',
                    emoji: '🟢',
                },
                {
                    type: 'reward',
                    refId: '1',
                    emoji: '💰'
                },
                {
                    type: 'reward',
                    refId: '1',
                    emoji: '💰'
                },
                {
                    type: 'blank',
                    refId: '',
                    emoji: '',
                }
            ];

        res.render('game', {
            grid,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
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

router.get('/signup', (req, res) => {
    // If the user is already logged in, redirect the request to the user dashboard
    if (req.session.logged_in) {
        res.redirect('/dashboard');
        return;
    }

//POST REQUEST - CREATE AND ADD IN DB
router.post('/signup', async (req, res) => {
    try {
        const dbUserData = await User.create({
        fullname: req.body.fullname,
        email: req.body.email,
        password: req.body.password,
        });

        //run nodemail code here to send welcome email
        
        sendMailit('New', dbUserData);
        
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

    res.render('signup',);
});

module.exports = router;