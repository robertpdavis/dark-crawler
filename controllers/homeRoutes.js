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


        //grid array example - consists of 5 arrays of 6 objects (columns)
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
        res.redirect('/dashboard');
        return;
    }

    res.render('login');
});

router.get('/signup', (req, res) => {
    // If the user is already logged in, redirect the request to the user dashboard
    if (req.session.logged_in) {
        res.redirect('/dashboard');
        return;
    }

    res.render('signup',);
});

module.exports = router;