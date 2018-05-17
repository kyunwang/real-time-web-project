const express = require('express');

const accountController = require('../controllers/accountController');
const musicController = require('../controllers/musicController');
const roomController = require('../controllers/roomController');

const router = express.Router();

// For now redirect the user
router.get('/', musicController.newReleased);

router.get('/featured', musicController.featuredPlaylist);
// router.get('/releases', musicController.newReleased);

router.get('/play', musicController.play);
// router.get('/playlist', musicController.publicPlaylist);
router.get('/playlist', musicController.publicPlaylist);
// router.post('/playlist/add/:uri', isLoggedIn, musicController.addToPlaylist);
// router.get('/discover', musicController.featuredPlaylist);

router.get('/album/:id', musicController.albumDetail);

// Rooms
router.get('/rooms', roomController.showRooms);
router.get('/room/:slug', roomController.singleRoom);
router.get('/rooms/private', isLoggedIn, roomController.privateRooms);
router.get('/rooms/new-room', isLoggedIn, roomController.roomForm);
router.post('/rooms/new-room', isLoggedIn, roomController.addRoom);

// User controller
router.get('/login', accountController.login);
router.get('/logout', accountController.resetAuth);
router.get('/auth', accountController.authorize);

function isLoggedIn(req, res, next) {
	console.log('Check logged in');

	if (req.session.authenticated) {
		return next();
	}

	res.redirect('/login');
}

module.exports = router;
