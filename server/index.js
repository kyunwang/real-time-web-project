const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const path = require('path');
const bodyParser = require('body-parser');

const spotifyApi = require('../config/api');

// Require db first as models are used in the routes
const db = require('./models/index');
const routes = require('./routes');

const helpers = require('../src/scripts/helpers');

const app = express();
const server = require('http').createServer(app);

const sockets = require('./sockets');

const io = require('socket.io')(server);

const sessionMiddleware = session({
	secret: process.env.SECRET,
	key: process.env.KEY,
	resave: false,
	saveUninitialized: false,
	store: new MongoStore({ mongooseConnection: mongoose.connection }),
});

// Connect the sockets
sockets(io, sessionMiddleware);

// Setting the view engine
app.set('view engine', 'pug').set('views', './server/views');

// Set static route
app.use('/public', express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json()).use(bodyParser.urlencoded({ extended: false }));
app.use(sessionMiddleware);

// Add global middleware available in templates and all routes
app.use((req, res, next) => {
	res.locals.h = helpers;
	req.spotifyApi = spotifyApi;
	next();
});

// Check the existance for accesstoken
app.use(async (req, res, next) => {
	// Get token (does not make an api call
	// Might need to save it in a session
	const accessToken = await spotifyApi.getAccessToken();

	// If this token is not undefined
	// if (!req.accessToken) {
	if (!accessToken) {
		spotifyApi
			.clientAuth()
			.then(data => {
				console.log('DONE CLIENT AUTH');
				// req.accessToken = data.body['access_token'];
				req.session.userId = null;
				req.session.name = 'Anonymous';
				next();
			})
			.catch(err => {
				console.error('CLIENT AUTH ERROR');
			});
	} else {
		console.log('TOKEN EXISTS');
		// Refresh here?
		next();
	}
});

app.use('/', routes);

server.listen(process.env.PORT || '8888', function() {
	console.log('Listening to port: ', process.env.PORT);
});
