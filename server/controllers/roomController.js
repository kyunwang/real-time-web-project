const mongoose = require('mongoose');

const Playlist = mongoose.model('Playlist');
const Room = mongoose.model('Room');

const spotifyApi = require('../../config/api');

const publicId = '1169335343';
const publicPlaylistId = '7mCLaqlcQ61U9HPMbGXwUd';
const options = { country: 'US' };

exports.showRooms = async (req, res) => {
	const rooms = await Room.find();
	// console.log('ROOMS', rooms);

	res.render('roomSelect', { rooms });
};

exports.roomForm = async (req, res) => {
	// Get user playlists
	const userPlaylists = await spotifyApi.getUserPlaylists(req.session.userId, options);

	const playlists = userPlaylists.body.items;

	res.render('roomForm', { playlists });
};

exports.addRoom = async (req, res) => {
	// console.log('REQ', req.body);
	try {
		const user = await spotifyApi.getMe();
		// console.log(user.body, user.body.id);

		const playlist = await spotifyApi.getPlaylist(req.session.userId, req.body.playlist, options);

		const data = playlist.body;
		const modifiedPlaylist = {
			name: data.name,
			image: data.images[0],
			tracks: data.tracks.items,
		};

		req.body.owner = user.body.id;
		req.body.playlist = modifiedPlaylist;
	} catch (err) {
		console.error(err);
	}

	req.body.public = Boolean(req.body.public);

	const newRoom = await new Room(req.body).save();

	// res.redirect(`/room/${newRoom.id}`);
	res.redirect(`/rooms`);
};

exports.singleRoom = async (req, res, next) => {
	const room = await Room.findOne({ slug: req.params.slug });
	const token = await spotifyApi.getAccessToken();

	// const [room, token] = await Promise.all([roomPromise, tokenPromise]);

	if (!room || !token) return next();

	res.render('roomSingle', {
		token: token,
		data: room,
		offlineMode: true,
		isOwner: room.owner == req.session.userId,
	});
};
