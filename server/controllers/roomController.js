const mongoose = require('mongoose');

const Playlist = mongoose.model('Playlist');
const Room = mongoose.model('Room');

const spotifyApi = require('../../config/api');

const publicId = '1169335343';
const publicPlaylistId = '7mCLaqlcQ61U9HPMbGXwUd';
const options = { country: 'US' };

exports.showRooms = async (req, res) => {
	const rooms = await Room.find({ public: true });
	// console.log('ROOMS', rooms);

	res.render('roomSelect', { rooms, currentPath: req.route.path });
};

exports.privateRooms = async (req, res) => {
	const rooms = await Room.find({
		public: false,
		$or: [{ owner: req.session.userId }, { members: { $in: [req.session.userId] } }],
	});
	// console.log('ROOMS', rooms);

	res.render('roomSelect', { rooms, currentPath: req.route.path });
};

exports.roomForm = async (req, res) => {
	// Get user playlists
	let playlists = [];
	try {
		const userPlaylists = await spotifyApi.getUserPlaylists(req.session.userId, options);

		playlists = userPlaylists.body.items;
	} catch (err) {
		console.error(err);
	}

	res.render('roomForm', { playlists });
};

exports.addRoom = async (req, res) => {
	try {
		const playlist = await spotifyApi.getPlaylist(req.session.userId, req.body.playlist, options);

		const data = playlist.body;
		const modifiedPlaylist = {
			name: data.name,
			image: data.images[0],
			tracks: data.tracks.items.map(item => (item.track)),
		};

		req.body.owner = req.session.userId;
		req.body.playlist = modifiedPlaylist;

		req.body.public = Boolean(req.body.public);

		const newRoom = await new Room(req.body).save();
	} catch (err) {
		return console.error(err);
	}

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
