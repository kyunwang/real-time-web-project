const express = require('express');

const accountController = require('../controllers/accountController');
const musicController = require('../controllers/musicController');

const router = express.Router();

// For now redirect the user
router.get('/', musicController.featuredPlaylist);

router.get('/featured', musicController.featuredPlaylist);
router.get('/releases', musicController.newReleased);
router.get('/play', musicController.play);
// router.get('/playlist', musicController.publicPlaylist);
router.get('/playlist', musicController.publicPlaylist);
router.post('/playlist/add/:uri', musicController.addToPlaylist);
// router.get('/discover', musicController.featuredPlaylist);

router.get('/album/:id', musicController.albumDetail);

router.get('/login', accountController.login);
router.get('/auth', accountController.authorize);

module.exports = router;