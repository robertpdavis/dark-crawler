// const router = require('express').Router();
// // const { User } = require('../models');
// const withAuth = require('../../utils/auth');
// // const sendMail = require('../../utils/email');
// // const randToken = require('rand-token');
// const Game = require('../../classes/Game');
// const CharacterClass = require('../../classes/Character');

// router.get('/', withAuth, async (req, res) => {
//     const menu = 
//     {
//         label1:'Save Game',
//         href1:'#',
//         label2: 'Finish Game',
//         href2:'#'
//     }
//     //Get grid data
//     // const game = new Game;
//     // const grid = await game.createGrid();
  
//     const character = new CharacterClass;
//     const characters = await character.getAll();
    
//     res.render('characters', { menu, characters, loggedIn: req.session.loggedIn, title: 'Characters', layout: 'main' });
//   });
  