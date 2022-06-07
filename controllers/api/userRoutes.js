const router = require('express').Router();
const { User } = require('../../models');
const sendMail = require('../../utils/email');

router.post('/', async (req, res) => {
  try {
    const userData = await User.create(req.body);

    req.session.save(() => {
      req.session.userId = userData.id;
      req.session.loggedIn = true;

      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
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
      req.session.userId = dbUserData.id;
      req.session.fullName = dbUserData.fullname,
      res
        .status(200)
        .json({ user: dbUserData, message: 'You are now logged in!' });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
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

// LOGOUT
router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
