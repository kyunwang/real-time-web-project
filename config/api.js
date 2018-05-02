const SpotifyWebApi = require('spotify-web-api-node');
const fetch = require('node-fetch');

require('dotenv').config({ path: 'vars.env' });

const scopes = [
	'user-read-private',
	'user-read-email',
	'user-modify-playback-state',
	'user-read-currently-playing',
	'user-read-playback-state',
	'user-read-currently-playing',
	'user-read-recently-played',
	'playlist-read-private',
	'playlist-read-collaborative',
	'playlist-modify-public',
	'playlist-modify-private',
];

const state = process.env.API_STATE;

const spotifyApi = new SpotifyWebApi({
	clientId: process.env.API_ID,
	clientSecret: process.env.API_SECRET,
	redirectUri: process.env.API_REDIRECT,
});

// The authoriization url generating from spotify api
spotifyApi.authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);

// const accessToken = spotifyApi.getAccessToken();

spotifyApi.clientAuth = function() {
	console.log('CLIENT ONLY GRANT');
	return spotifyApi.clientCredentialsGrant().then(
		function(data) {
			// Save the access token so that it's used in future calls
			spotifyApi.setAccessToken(data.body['access_token']);
		},
		function(err) {
			console.log('Something went wrong when retrieving an access token', err);
		}
	);
};

module.exports = spotifyApi;
