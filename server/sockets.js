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

		/*==========================
		=== Socket (helper)function
		===========================*/
		async function addUserToRoom(data) {
			console.log('User added to room: ', socket.request.session.username);

			// Add the user to the Room model
			// To a members array?

			// if ()
		}

		function addTrack(trackUri) {
			// Public room is the default for now
			console.log('Server add track', trackUri);
			// await spotifyApi
			// 	.addTracksToPlaylist(publicId, publicPlaylistId, [uri])
			// 	.then(data => {
			// 		console.log('DONE', data);
			// 	})
			// 	.catch(err => {
			// 		console.log('ERROR: ', err);
			// 	});

			// const playlist = await spotifyApi.getPlaylist(publicId, publicPlaylistId);

			spotifyApi
				.getTrack(trackUri)
				.then(track => {
					// console.log(track);

					// Room.findOneAndUpdate

					Room.update(
						{ name: currentRoom },
						{ $push: { 'playlist.tracks': track.body } },
						{ safe: true, upsert: true }
						// function(err, room) {
						// 	if (err) throw error;
						// 	console.log('update user complete');
						// }
					).then(room => {
						console.log('THE ROOM UPDATED', room);
					});
				})
				.catch(err => console.error(err));

			// Update the currently joined room

			// Send to everyone except self
			socket.broadcast.to('Public Room').emit('addTrack', 'hello');
			// socket.broadcast.to('Public Room').emit('addTrack', newTrack);
			// io.to('Public Room').emit('addTrack', track);
		}
	});
}

module.exports = sockets;
