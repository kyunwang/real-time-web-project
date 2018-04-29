const mongoose = require('mongoose');

const db = mongoose.connection;

// Connect to our Database and handle any bad connections
mongoose.connect(process.env.DB);
// Tell Mongoose to use ES6 promises
mongoose.Promise = global.Promise;

// Importing the models
const User = require('./User');
const Playlist = require('./Playlist');
const Room = require('./Room');

db.on('connected', () => {
	console.log(`MongoDB connected`);
});

db.on('error', err => {
	// console.error(`Error: ${err.message}`);
	console.error(`Error: With database`);
});
