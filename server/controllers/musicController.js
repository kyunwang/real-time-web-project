// const mongoose = require('mongoose');

const spotifyApi = require('../../config/api');
const { authorizeURL } = spotifyApi;

// const Playlist = mongoose.model('Playlist');
const mongoose = require('mongoose');

const Room = mongoose.model('Room');

const publicId = '1169335343';
const publicPlaylistId = '7mCLaqlcQ61U9HPMbGXwUd';

exports.featuredPlaylist = async (req, res) => {
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

exports.addToPlaylist = async (req, res) => {
	const { uri } = req.params;

	await spotifyApi
		.addTracksToPlaylist(publicId, publicPlaylistId, [uri])
		.then(data => {
			console.log('DONE', data);
		})
		.catch(err => {
			console.log('ERROR: ', err);
		});

	const playlist = await spotifyApi.getPlaylist(publicId, publicPlaylistId);
	// console.log(playlist);

	Room.update(
		{
			playlist: playlist.body,
		},
		function(err, user) {
			if (err) throw error;
			console.log('update user complete');
		}
	);
};

exports.play = (req, res) => {
	// const { id } = req.params;
	// Get information about current playing song for signed in user
	spotifyApi.getMyCurrentPlaybackState({}).then(
		function(data) {
			// Output items
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
