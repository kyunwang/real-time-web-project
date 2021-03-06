const { room, playlist } = require('./trackModule');

if (typeof accessToken != 'undefined') {
	console.log('Player Init');

	// Documentation: https://beta.developer.spotify.com/documentation/web-playback-sdk/quick-start/

	window.onSpotifyWebPlaybackSDKReady = () => {
		const token = JSON.parse(accessToken);

		const player = new Spotify.Player({
			name: 'Spotify Playlist Collab',
			getOAuthToken: cb => {
				cb(token);
			},
		});

		// Error handling
		player.addListener('initialization_error', ({ message }) => {
			console.error(message);
		});
		player.addListener('authentication_error', ({ message }) => {
			console.error(message);
		});
		player.addListener('account_error', ({ message }) => {
			console.error(message);
		});
		player.addListener('playback_error', ({ message }) => {
			console.error(message);
		});

		// Playback status updates
		player.addListener('player_state_changed', state => {
			console.log(state);
		});

		// Ready
		player.addListener('ready', ({ device_id }) => {
			console.log('Ready with Device ID', device_id);
		});

		// Not Ready
		player.addListener('not_ready', ({ device_id }) => {
			console.log('Device ID has gone offline', device_id);
		});

		// Connect to the player!
		player.connect();

		// Play controls
		const play = ({
			spotify_uri,
			playerInstance: {
				_options: { getOAuthToken, id },
			},
		}) => {
			getOAuthToken(access_token => {
				fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
					method: 'PUT',
					body: JSON.stringify({ uris: [spotify_uri] }),
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${access_token}`,
					},
				});
			});
		};

		room.player = player;
		room.play = play;
		playlist.init();
		room.init();
	};
} else {
	console.log('Normal Init');

	playlist.init();
	room.init();
}
