const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// const trackSchema = new mongoose.Schema({});

const playlistSchema = new mongoose.Schema({
	name: {
		type: String,
		required: 'Enter a playlistname please',
	},
	public: {
		type: Boolean,
		default: true,
	},
	// tracks: {
	// 	type: [Track],
	// },
	// votes: {
	// 	type: Number,
	// 	default: 0,

	// },
	owner: {
		type: Number,
		required: 'A owner is required to be assigned',
	},
});

// export default mongoose.model('Playlist', playlistSchema);
module.exports = mongoose.model('Playlist', playlistSchema);
