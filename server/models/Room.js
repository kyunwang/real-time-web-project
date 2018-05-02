const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
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
	members: {
		type: Array,
	},
});

roomSchema.pre('save', async function(next) {
	this.slug = slug(this.name);

	next();
});

module.exports = mongoose.model('Room', roomSchema);
