const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const userSchema = new mongoose.Schema({
	name: String,
	spotifyId: {
		type: Number,
		required: 'You need to provide the spotify id',
	},
});

module.exports = mongoose.model('User', userSchema);
