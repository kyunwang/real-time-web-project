const h = require('./helpers');
const { $, $$, addEvent, createNode, milliToMinSec } = h;
// const createNode = h.createNode;

(function() {
	const socket = io();

	const room = {
		init: function() {
			this.start();
		},
		start: function() {
			console.log('Room start');

			// Join the user to a room (public room) for now
			socket.emit('joinRoom', 'Public Room');

			// Response to room joined (unneccesary?)
			socket.on('joinRoom', function(room) {
				console.log('ROOM joined', room);
			});

			socket.on('addTrack', this.addTrack);

			// Check wheter the server is online or not through the sockets
			// Is unneeded because of offline.js but will keep it for future use
			// socket.on('connect_error', function() {
			// 	console.log('Is The Server Online? ' + socket.connected);
			// });

			// socket.on('connect', function() {
			// 	console.log('Is The Server Online? ' + socket.connected);
			// });
		},
		addTrack: function(track) {
			console.log('Adding track', track);

			// Get table, create new table row + items, append new table row
			const tr = createNode('tr');
			const trackName = createNode('td', track.name);
			const trackTime = createNode('td', milliToMinSec(track.duration_ms));
			const buttonCon = createNode('td');
			// const addButton = createNode('button', '+', 'track__add', track.id, `uri: ${track.uri}`);
			// buttonCon.appendChild(addButton);

			tr.appendChild(trackName);
			tr.appendChild(trackTime);
			tr.appendChild(buttonCon);

			const playlist = $('table');

			playlist.appendChild(tr);
		},
	};

	const playlist = {
		addButtons: [],
		init: function() {
			this.addButtons = $$('.track__add');

			addEvent('click', this.addButtons, playlist.addTrack);
		},
		addTrack: function(e) {
			const trackUri = this.dataset.uri;
			socket.emit('addTrack', trackUri);
		},
	};

	playlist.init();

	room.init();
})();
