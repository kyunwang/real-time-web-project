const { $, $$, addEvent, createNode, milliToMinSec } = require('./helpers');

const socket = io();

const playlist = {
	addButtons: [],
	removeButtons: [],
	trackPlayBtn: [],
	init: function() {
		console.log('Playlist Init');
		this.addButtons = $$('.track__add');
		this.removeButtons = $$('.track__remove');
		this.trackPlayBtn = $$('.track__playBtn');

		console.log(this);

		addEvent('click', this.addButtons, playlist.addTrack);
		addEvent('click', this.removeButtons, playlist.removeTrack);
		addEvent('click', this.trackPlayBtn, playlist.playListTrack);
	},
	addTrack: function(e) {
		console.log('add');

		const trackId = this.dataset.trackId;
		socket.emit('addTrack', trackId);
	},
	removeTrack: function(e) {
		const trackId = this.dataset.trackId;
		socket.emit('removeTrack', trackId);
	},
	playListTrack: function(e) {
		const trackUri = this.dataset.trackUri;
		console.log(this, trackUri, this.dataset);
		socket.emit('playListTrack', trackUri);
	},
};

const room = {
	init: function() {
		console.log('Room start');
		this.start();
	},
	start: function() {
		// Join the user to a room (public room) for now
		socket.emit('joinRoom', 'Public Room');

		// Response to room joined (unneccesary?)
		socket.on('joinRoom', function(room) {
			console.log('ROOM joined', room);
		});

		socket.on('addTrack', this.addTrack);
		socket.on('removeTrack', this.removeTrack);
		socket.on('playListTrack', this.playListTrack);

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
		const playBtnCon = createNode('td');
		const playButton = createNode('button', 'play', 'track__playBtn', null, 'trackUri', track.uri);
		playBtnCon.appendChild(playButton);
		// const buttonCon = createNode('td');
		// const addButton = createNode('button', '+', 'track__add', track.id, `uri: ${track.uri}`);
		// buttonCon.appendChild(addButton);

		tr.appendChild(trackName);
		tr.appendChild(trackTime);
		tr.appendChild(playBtnCon);

		addEvent('click', [playButton], playlist.playListTrack);

		const roomList = $('table');

		roomList.appendChild(tr);
	},
	removeTrack: function(trackId) {
		// This didn't work
		// const track = $(`#${trackId}`);
		const track = document.getElementById(trackId);
		track.remove();
	},
	playListTrack: function(trackUri) {
		console.log('Playing: ', trackUri);

		room.play({
			playerInstance: room.player,
			spotify_uri: trackUri,
		});
	},
};

module.exports.room = room;
module.exports.playlist = playlist;
