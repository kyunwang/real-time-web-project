const mongoose = require('mongoose');

// const socketController = require('./controllers/socketController');

require('dotenv').config({ path: 'vars.env' });

// const spotifyApi = require('../config/api');

// Connect to our Database and handle any bad connections
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
mongoose.connection.on('error', err => {
	// console.error(`Error: ${err.message}`);
	console.error(`Error: With database`);
});

// consting = require(our model)s
const User = require('./models/User');
require('./models/Playlist');
const Room = require('./models/Room');

const app = require('./app');
const sessionMiddleware = app.sessionMiddleware;

const server = app.listen(process.env.PORT, function() {
	console.log('Listening to port: ', process.env.PORT);
});

/*==========================
=== Socket io part
===========================*/
const io = require('socket.io')(server);

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
