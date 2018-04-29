function sockets(io, sessionMiddleware) {
	// Share express sessions with socket.io
	io.use(function(socket, next) {
		sessionMiddleware(socket.request, socket.request.res, next);
	});

	// Sockets start
	io.on('connection', socket => {
		socket.on('joinRoom', async function(room) {
			console.log('Room joined', room);
			// console.log(socket.request.session);
			// socket.handshake.session
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
			// console.log(await User.findOne({ spotifyId: socket.request.session.userId }));
			console.log('User added to room: ', socket.request.session.username);

			// if ()
		}

		function addTrack(track) {
			// Public room is the default for now
			console.log('Server add track');

			// Send to everyone except self
			socket.broadcast.to('Public Room').emit('addTrack', track);
			// io.to('Public Room').emit('addTrack', track);
		}
	});
}

module.exports = sockets;
