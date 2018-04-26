const mongoose = require('mongoose');

const Playlist = mongoose.model('Playlist');
const Room = mongoose.model('Room');

const spotifyApi = require('../../config/api');

const publicId = '1169335343';
const publicPlaylistId = '7mCLaqlcQ61U9HPMbGXwUd';

exports.showRooms = async (req, res) => {
	const rooms = await Room.find();
	// console.log('ROOMS', rooms);

	res.render('roomSelect', { rooms });
};

exports.roomForm = (req, res) => {
	res.render('newRoomForm', {});
};

exports.addRoom = async (req, res) => {
	// console.log('REQ', req.body);
	try {
		const user = await spotifyApi.getMe();
		// console.log(user.body, user.body.id);

		const playlist = await spotifyApi.getPlaylist(user.body.id, req.body.playlist);
		req.body.owner = user.body.id;
		req.body.playlist = playlist.body;
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

	if (!room) return next();

	res.render('singleRoom', { data: room });
};
