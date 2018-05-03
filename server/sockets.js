const mongoose = require('mongoose');
const Room = mongoose.model('Room');

const spotifyApi = require('../config/api');

const publicId = '1169335343';
const publicPlaylistId = '7mCLaqlcQ61U9HPMbGXwUd';
const options = { country: 'US' };

// Static room(s) for now
const currentRoom = 'Public Room';

function sockets(io, sessionMiddleware) {
	// Share express sessions with socket.io
	io.use(function(socket, next) {
		sessionMiddleware(socket.request, socket.request.res, next);
	});

	// Sockets start
	io.on('connection', socket => {
		socket.on('joinRoom', async function(room) {
			console.log('Room joined', room);
			addUserToRoom();

			socket.emit('joinRoom', room);
			// socket.join(room || 'Public Room');
			socket.join('Public Room');
			// io.to(room).emit('message', 'what is going on, party people?');
		});

		socket.on('addTrack', addTrack);
		socket.on('removeTrack', removeTrack);

		// Play a track selected from the playlist track
		socket.on('playListTrack', playListTrack);

		/*==========================
		=== Socket (helper)function
		===========================*/
		async function addUserToRoom(data) {
			console.log('User added to room: ', socket.request.session.username);

			// Add the user to the Room model
			// To a members array?

			// if ()
		}

		function addTrack(trackId) {
			// Public room is the default for now
			console.log('Adding track', trackId);

			spotifyApi
				.getTrack(trackId)
				.then(track => {
					// Update the currently joined rooms playlist
					Room.update(
						{ name: currentRoom },
						{ $push: { 'playlist.tracks': track.body } },
						{ safe: true, upsert: true }
					).then(room => {
						// Send to everyone except self
						socket.broadcast.to('Public Room').emit('addTrack', track.body);
					});
				})
				.catch(err => console.error(err));

			// socket.broadcast.to('Public Room').emit('addTrack', newTrack);
			// io.to('Public Room').emit('addTrack', track);
		}

		function removeTrack(trackId) {
			console.log('removing track', trackId);

			Room.update(
				{ name: currentRoom },
				{ $pull: { 'playlist.tracks': { id: trackId } } },
				{ safe: true, upsert: true }
			)
				.then(room => {
					// Send to everyone in room including sender
					io.sockets.in('Public Room').emit('removeTrack', trackId);
				})
				.catch(err => console.error(err));
		}

		function playListTrack(trackUri) {
			console.log(trackUri);

			io.sockets.in('Public Room').emit('playListTrack', trackUri);
		}
	});
}

module.exports = sockets;
