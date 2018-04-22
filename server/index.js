const mongoose = require('mongoose');

require('dotenv').config({ path: 'vars.env' });

const spotifyApi = require('../config/api');

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

app.listen(process.env.PORT, function() {
	console.log('Listening to port: ', process.env.PORT);
});
