const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	name: String,
	spotifyId: {
		type: Number,
		required: 'You need to provide the spotify id',
	},
	// liked_tracks: []
});

module.exports = mongoose.model('User', userSchema);
