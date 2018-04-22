const spotifyApi = require('../../config/api');

// Redirects to spotify login window
exports.login = (req, res) => {
	res.redirect(spotifyApi.authorizeURL);
};

// Handle the authorization
exports.authorize = (req, res) => {
	const { code } = req.query;
	spotifyApi.authorizationCodeGrant(code).then(
		function(data) {
			console.log('GRANT USER TOKEN');
			// console.log('The token expires in ' + data.body['expires_in']);

			// Set the access token on the API object to use it in later calls
			spotifyApi.setAccessToken(data.body['access_token']);
			spotifyApi.setRefreshToken(data.body['refresh_token']);

			res.redirect('/releases');
		},
		function(err) {
			console.log('Something went wrong!', err);
		}
	);
};

// To logout as user? Still in debate
exports.resetAuth = (req, res) => {
	// spotifyApi.resetCredentials();
};
