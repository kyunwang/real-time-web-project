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
		},
		addTrack: function(track) {
			console.log('Adding track', track);

			return;
			// Get table, create new table row + items, append new table row
			const tr = createNode('tr');
			const trackName = createNode('td', track.name);
			const trackTime = createNode('td', milliToMinSec(track.duration_ms));
			const buttonCon = createNode('td');
			const addButton = createNode('button', '+', 'track__add', track.id, `uri: ${track.uri}`);
			buttonCon.appendChild(addButton);

			tr.appendChild(trackName);
			tr.appendChild(trackTime);
			tr.appendChild(buttonCon);

			const playlist = $('table');
			// console.log(playlist);

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
			console.log(trackUri);

			// Dit omzetten
			// 1. verwijdere exports.addToplaylists

			// 2. In de socket call api call amken naar track/uri
			// 3. update de room/playlist in de io.on/socket,on server side
			// 4. update overal via sockets
			// 5. verwijdere de data.stringify client side
			// 6. voeg de nieuwe item client side toe aan de playlist

			// Get the track we have selected

			// Emit to the room/ add the track to the room
			// Add the track to the spotify playlist too

			// fetch(`/playlist/add/${uri}`, {
			// 	method: 'POST',
			// })
			// 	.then(res => {
			// 		console.log('Succesful added to public playlist');
			// 	})
			// 	.catch(err => {
			// 		console.error(`Error trying to add to public playlist: ${err}`);
			// 	});

			socket.emit('addTrack', trackUri);
		},
	};

	playlist.init();

	room.init();
})();
