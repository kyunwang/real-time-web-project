const h = require('./helpers');
const { $, $$, addEvent } = h;

const player = {
	addButtons: [],
	init: function() {
		this.addButtons = $$('.track__add');

		addEvent('click', this.addButtons, player.addTrack);
	},
	addTrack: function(e) {
		// console.log(this.dataset.uri);
		const uri = this.dataset.uri;
		fetch(`/playlist/add/${uri}`, {
			method: 'POST',
		})
			.then(res => {
				console.log('Succesful added to public playlist');
			})
			.catch(err => {
				console.error(`Error trying to add to public playlist: ${err}`);
			});
	},
};

exports.startPlayer = player.init;
