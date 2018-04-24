const mongoose = require('mongoose');
const slug = require('slugs');

const roomSchema = new mongoose.Schema({
	name: {
		type: String,
		required: 'A Name has to be assinged to a room',
	},
	slug: {
		type: String,
		unique: true,
	},
	public: {
		type: Boolean,
		default: true,
	},
	owner: {
		type: Number,
		required: 'A owner has to be assigned to a room',
	},
	playlist: {
		type: Object,
		required: 'A Playlist is required for a room',
	},
});

roomSchema.pre('save', async function(next) {
	// this.owner = user.id;
	// this.playlist = playlist;
	// this.public = Boolean(this.public);
	this.slug = slug(this.name);
	// console.log('CHECK', this);

	next();
});

module.exports = mongoose.model('Room', roomSchema);
