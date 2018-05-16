const mongoose = require('mongoose');
const spotifyApi = require('../../config/api');

const User = mongoose.model('User');

// Redirects to spotify login window
exports.login = (req, res) => {
	res.redirect(spotifyApi.authorizeURL);
};

// Handle the authorization
exports.authorize = async (req, res) => {
	const { code } = req.query;
	console.log('AUTH');

	try {
		// Get the tokens
		const data = await spotifyApi.authorizationCodeGrant(code);

		// Set the tokens at once together
		await Promise.all([
			spotifyApi.setAccessToken(data.body['access_token']),
			spotifyApi.setRefreshToken(data.body['refresh_token']),
		]);

		// Get the user and save basic data in database for room allocation
		const theUser = await spotifyApi.getMe();

		User.findOne({ spotifyId: theUser.body.id }, async function(err, data) {
			if (err) console.log(err);
			console.log('Create user');

			console.log('data', data);
			if (!data) {
				console.log('User not found');
				const newUser = await new User({
					// _id: theUser.body.id,
					spotifyId: theUser.body.id,
					name: theUser.body.display_name || 'Music Lover',
				}).save();
			}
			// return data;
		});

		req.session.user = theUser.body;
		// console.log(theUser.body);

		req.session.authenticated = true;
		req.session.userId = theUser.body.id;
		req.session.username = theUser.body.display_name;

		res.redirect('/');
	} catch (err) {
		return console.error(err);
	}
};

// To logout as user? Still in debate
exports.resetAuth = (req, res) => {
	spotifyApi.resetCredentials();

	req.session.user = null;
	req.session.authenticated = null;
	req.session.userId = null;
	req.session.username = null;

	res.redirect('/');
};
