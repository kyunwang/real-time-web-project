const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
	name: {
		type: String,
		required: 'A Name has to be assinged to a room',
	},
	public: {
		type: Boolean,
		default: true,
	},
	owner: {
		type: Number,
		required: 'A owner has to be assigned to a room',
	},
});

module.exports = mongoose.model('Room', roomSchema);
