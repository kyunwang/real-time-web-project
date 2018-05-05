const { $, $$, addEvent, createNode, milliToMinSec, icon } = require('./helpers');

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
		const playButton = createNode('button', null, ['track__action', 'track__playBtn'], null, 'trackUri', track.uri);

		// For now inject as html
		playButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M371.7 238l-176-107c-15.8-8.8-35.7 2.5-35.7 21v208c0 18.4 19.8 29.8 35.7 21l176-101c16.4-9.1 16.4-32.8 0-42zM504 256C504 119 393 8 256 8S8 119 8 256s111 248 248 248 248-111 248-248zm-448 0c0-110.5 89.5-200 200-200s200 89.5 200 200-89.5 200-200 200S56 366.5 56 256z"/></svg>';
		playBtnCon.appendChild(playButton);

		// const buttonCon = createNode('td');
		// const addButton = createNode('button', '+', 'track__add', track.id, `uri: ${track.uri}`);
		// buttonCon.appendChild(addButton);

		tr.appendChild(trackName);
		tr.appendChild(trackTime);
		tr.appendChild(playBtnCon);

		addEvent('click', [playButton], playlist.playListTrack);

		const roomList = $('.room__playlist');

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
