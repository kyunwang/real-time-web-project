const h = require('./helpers');
const { $, $$, addEvent, createNode } = h;
// const createNode = h.createNode;

(function() {
	const socket = io();

	const room = {
		init: function() {
			console.log('INIT');
			// const self = this;
			// if (data.type === 'musicDetail') {
			// 	return;
			// }
			this.start();
		},
		start: function() {
			console.log('Room start');

			socket.emit('joinRoom', data.name || 'Public Room');

			socket.on('joinRoom', function(room) {
				console.log('ROOM joined', room);
			});

			socket.on('message', data => {
				console.log('Message to room', data);
			});

			socket.on('addTrack', this.addTrack);
		},
		addTrack: function(data) {
			console.log('Adding track', data);
		},
	};

	const playlist = {
		addButtons: [],
		init: function() {
			this.addButtons = $$('.track__add');

			addEvent('click', this.addButtons, playlist.addTrack);
		},
		addTrack: function(e) {
			// console.log(this.dataset.uri);
			const uri = this.dataset.uri;
			console.log(e.target);

			socket.emit('addTrack', 123);

			// fetch(`/playlist/add/${uri}`, {
			// 	method: 'POST',
			// })
			// 	.then(res => {
			// 		console.log('Succesful added to public playlist');
			// 	})
			// 	.catch(err => {
			// 		console.error(`Error trying to add to public playlist: ${err}`);
			// 	});
		},
	};

	if (data.type === 'musicDetail') {
		playlist.init();
	} else {
	}

	room.init();
})();
