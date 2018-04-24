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
require('./models/User');
require('./models/Playlist');
require('./models/Room');

const app = require('./app');

const server = app.listen(process.env.PORT, function() {
	console.log('Listening to port: ', process.env.PORT);
});

const io = require('socket.io')(server);

io.on('connection', socket => {
	console.log('test');

	socket.on('joinRoom', function(room) {
		console.log('Room joined', room);

		socket.emit('joinRoom', room);
		socket.join(room || 'Public Room');
		// io.to(room).emit('message', 'what is going on, party people?');
	});

	socket.on('addTrack', addTrack);
});

function addTrack(data) {
	// Public room is the default for now
	console.log('Server add track', data);

	io.to('Public Room').emit('addTrack', 'Track added');
}
