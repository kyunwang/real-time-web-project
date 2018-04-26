const h = require('./helpers');
const { $, $$, addEvent, createNode, milliToMinSec } = h;
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
		addTrack: function(track) {
			console.log('Adding track', track);
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
			// console.log(this.dataset.uri);
			const tracks = JSON.parse(data.tracks);
			const uri = this.dataset.uri;

			// Get the track we have selected
			const track = tracks.items.filter(track => track.uri === uri)[0];

			// Emit to the room/ add the track to the room
			// Add the track to the spotify playlist too
			fetch(`/playlist/add/${uri}`, {
				method: 'POST',
			})
				.then(res => {
					console.log('Succesful added to public playlist');
				})
				.catch(err => {
					console.error(`Error trying to add to public playlist: ${err}`);
				});

			socket.emit('addTrack', track);
		},
	};

	if (data.type === 'musicDetail') {
		playlist.init();
	} else {
	}

	room.init();
})();
