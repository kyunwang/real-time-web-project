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

		// console.log(User.findOne({ _id: theUser.body.id }, { lean: true }));
		// console.log(User.findOne({ _id: theUser.body.id }));

		// const userExists =
		User.findOne({ spotifyId: theUser.body.id }, async function(err, data) {
			if (err) console.log(err);
			// console.log('data', data);
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
		// console.log('2312321321', userExists);

		req.session.userId = theUser.body.id;
		req.session.username = theUser.body.display_name;

		res.redirect('/releases');
	} catch (err) {}

	// .then(
	// 	function(data) {
	// 		console.log('GRANT USER TOKEN');
	// 		// console.log('The token expires in ' + data.body['expires_in']);
	// 		console.log(data);

	// 		// Set the access token on the API object to use it in later calls
	// 		spotifyApi.setAccessToken(data.body['access_token']);
	// 		spotifyApi.setRefreshToken(data.body['refresh_token']);

	// 		spotifyApi.getMe()

	// 		res.redirect('/releases');
	// 	},
	// 	function(err) {
	// 		console.log('Something went wrong!', err);
	// 	}
	// );
};

// To logout as user? Still in debate
exports.resetAuth = (req, res) => {
	// spotifyApi.resetCredentials();
};
