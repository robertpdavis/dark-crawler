const router = require('express').Router();
const { User } = require('../models');
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
    const menu = 
    {
      label1:'Option 1',
      href1:'#',
      label2: 'Option 2',
      href2:'#'
    }


    res.render('dashboard', { menu, loggedIn: req.session.loggedIn, title: 'Dashboard', layout: 'main' });
});

router.get('/game', withAuth, async (req, res) => {
  const menu = 
  {
      label1:'Save Game',
      href1:'#',
      label2: 'Finish Game',
      href2:'#'
  }
  //Get grid data
  const gameHandler = new GameHandler;
  const grid = await gameHandler.createGrid();

  res.render('game', { menu, grid, loggedIn: req.session.loggedIn, title: 'Game Board', layout: 'main' });
});

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
        console.log(token);
            const reset = await User.update({password_reset_code: token}, {
                where: { email: req.body.email }
            });
      
        if (reset) {
          const args = {
            email: req.body.email,
            code : token
          }
          console.log(args);
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
  console.log(req.body.email);
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

      console.log(req.body.password);
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
module.exports = router;