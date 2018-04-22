const mongoose = require('mongoose');

const spotifyApi = require('../../config/api');
const { authorizeURL } = spotifyApi;

const Playlist = mongoose.model('Playlist');

const publicId = '1169335343';
const publicPlaylistId = '7mCLaqlcQ61U9HPMbGXwUd';

exports.featuredPlaylist = async (req, res) => {
	// console.log(spotifyApi.getAccessToken());
	// new Cat({ name: 'Zildjian' });
	// kitty.save().then(() => console.log('meow'));
	// console.log(Playlist);
	// try {
	// 	const me = await spotifyApi.getMe();

	// 	const list = await spotifyApi.getUserPlaylists(1169335343);
	// 	// console.log(list.body.items);
	// } catch (err) {
	// 	console.log(err);
	// }

	spotifyApi
		// .getTrack('3Qm86XLflmIXVm1wcwkgDK')
		// .getPlaylistsForCategory()

		.getFeaturedPlaylists()
		// .getNewReleases()
		// .getCategories() // Discover
		.then(data => {
			res.render('musicOverview', {
				message: 'Hello Server!',
				data: data.body.playlists || 'nope',
			});
		})
		.catch(err => {
			console.log('Error', err);
			res.render('musicOverview', {
				message: 'Error!',
				data: err || false,
			});
		});
};

exports.newReleased = (req, res) => {
	spotifyApi
		.getNewReleases()
		// .getCategories() // Discover
		.then(data => {
			console.log(data.body.albums);
			res.render('musicOverview', {
				message: 'Hello Server!',
				data: data.body.albums || 'nope',
			});
		})
		.catch(err => {
			console.log('Error', err);
			res.render('musicOverview', {
				message: 'Error!',
				data: err || false,
			});
		});
};

exports.albumDetail = (req, res) => {
	const { id } = req.params;

	spotifyApi
		.getAlbum(id)
		.then(data => {
			res.render('musicDetail', {
				message: 'Hello Server!',
				data: data.body || 'nope',
			});
		})
		.catch(err => {
			console.log('Error', err);
			res.render('musicDetail', {
				message: 'Error!',
				data: err || false,
			});
		});
};

exports.publicPlaylist = (req, res) => {
	spotifyApi
		// The public id and playlist id. Is ok to show
		.getPlaylist(publicId, publicPlaylistId)
		// .getPlaylistTracks('1169335343', '7mCLaqlcQ61U9HPMbGXwUd')
		.then(data => {
			console.log(data);

			res.render('musicDetail', {
				message: 'Hello Server!',
				data: data.body || 'nope',
			});
		})
		.catch(err => {
			console.log('Error', err);
			res.render('musicDetail', {
				message: 'Error!',
				data: err || false,
			});
		});
};

exports.addToPlaylist = (req, res) => {
	const { uri } = req.params;
	spotifyApi
		.addTracksToPlaylist(publicId, publicPlaylistId, [uri])
		.then(data => {
			console.log('DONE', data);
		})
		.catch(err => {
			console.log('ERROR: ', err);
		});
};

exports.play = (req, res) => {
	// const { id } = req.params;
	// Get information about current playing song for signed in user
	spotifyApi.getMyCurrentPlaybackState({}).then(
		function(data) {
			// Output items
			console.log('Now Playing: ', data.body);
			res.redirect('/releases');
		},
		function(err) {
			console.log('Something went wrong!', err);
		}
	);
	// spotifyApi
	// 	.getAlbum(id)
	// 	.then(data => {
	// 		res.render('musicDetail', {
	// 			message: 'Hello Server!',
	// 			data: data.body || 'nope',
	// 		});
	// 	})
	// 	.catch(err => {
	// 		console.log('Error', err);
	// 		res.render('musicDetail', {
	// 			message: 'Error!',
	// 			data: err || false,
	// 		});
	// 	});
};
