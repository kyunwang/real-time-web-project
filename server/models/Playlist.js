const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const playlistSchema = new mongoose.Schema({
	name: {
		type: String,
		required: 'Enter a playlistname please',
	},
	public: {
		type: Boolean,
		default: true,
	},
	owner: {
		type: Number,
		required: 'A owner is required to be assigned',
	},
});

module.exports = mongoose.model('Playlist', playlistSchema);
