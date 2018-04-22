const express = require('express');

const path = require('path');
const bodyParser = require('body-parser');

const app = express();

const spotifyApi = require('../config/api');

const routes = require('./routes');

const helpers = require('../src/scripts/helpers');

// Setting the view engine
app.set('view engine', 'pug').set('views', './server/views');

// Set static route
app.use('/public', express.static(path.join(__dirname, '../public')));
// app.use('/', express.static(path.join(__dirname, '../public'), { maxAge: '31d' })); // This will cache the folder for 31days

// Use bodyparser
app.use(bodyParser.json()).use(bodyParser.urlencoded({ extended: false }));

// Add global middleware available in templates and all routes
app.use((req, res, next) => {
	res.locals.h = helpers;
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

module.exports = app;
