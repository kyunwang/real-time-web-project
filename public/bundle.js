(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
exports.$ = function(element) {
	return document.querySelector(element);
};

exports.$$ = function(element) {
	return document.querySelectorAll(element);
};

exports.addEvent = function(event, elements, callback) {
	elements.forEach(el => {
		el.addEventListener(event, callback);
	});
};

exports.createNode = function(element = 'li', text = '', className, idName, dataName, dataAttr) {
	const node = document.createElement(element);

	if (text) {
		const textNode = document.createTextNode(text);
		node.appendChild(textNode);
	}

	if (className) {
		node.classList.add(className);
	}

	if (idName) {
		node.setAttribute('id', idName);
	}

	if (dataName && dataAttr) {
		node.setAttribute('data', dataAttr);
		node.dataset[dataName] = dataAttr;
	}

	return node;
};

// Dump is a handy debugging function we can use to sort of "console.log" our data
exports.dump = function(obj) {
	return JSON.stringify(obj, null, 2);
};

exports.handleError = function(err) {
	if (err) {
	}
};

// https://stackoverflow.com/questions/21294302/converting-milliseconds-to-minutes-and-seconds-with-javascript
exports.milliToMinSec = function(millis) {
	millis = 1000 * Math.round(millis / 1000); // round to nearest second
	const d = new Date(millis);
	const seconds = d.getUTCSeconds() > 9 ? d.getUTCSeconds() : `0${d.getUTCSeconds()}`;

	return `${d.getUTCMinutes()}:${seconds}`;
};

exports.icon = name => fs.readFileSync(`./public/images/icons/${name}.svg`);

exports.topMenu = [
	{ slug: '/', title: 'New releases' },
	{ slug: '/featured', title: 'Featured' },
	// { slug: '/map', title: 'Map' },
];

exports.sideMenu = [{}];

},{}],2:[function(require,module,exports){
const { room, playlist } = require('./trackModule');

if (typeof accessToken != 'undefined') {
	console.log('Player Init');

	// Documentation: https://beta.developer.spotify.com/documentation/web-playback-sdk/quick-start/

	window.onSpotifyWebPlaybackSDKReady = () => {
		const token = JSON.parse(accessToken);

		const player = new Spotify.Player({
			name: 'Spotify Playlist Collab',
			getOAuthToken: cb => {
				cb(token);
			},
		});

		// Error handling
		player.addListener('initialization_error', ({ message }) => {
			console.error(message);
		});
		player.addListener('authentication_error', ({ message }) => {
			console.error(message);
		});
		player.addListener('account_error', ({ message }) => {
			console.error(message);
		});
		player.addListener('playback_error', ({ message }) => {
			console.error(message);
		});

		// Playback status updates
		player.addListener('player_state_changed', state => {
			console.log(state);
		});

		// Ready
		player.addListener('ready', ({ device_id }) => {
			console.log('Ready with Device ID', device_id);
		});

		// Not Ready
		player.addListener('not_ready', ({ device_id }) => {
			console.log('Device ID has gone offline', device_id);
		});

		// Connect to the player!
		player.connect();

		// Play controls
		const play = ({
			spotify_uri,
			playerInstance: {
				_options: { getOAuthToken, id },
			},
		}) => {
			getOAuthToken(access_token => {
				fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
					method: 'PUT',
					body: JSON.stringify({ uris: [spotify_uri] }),
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${access_token}`,
					},
				});
			});
		};

		room.player = player;
		room.play = play;
		playlist.init();
		room.init();
	};
} else {
	console.log('Normal Init');

	playlist.init();
	room.init();
}

},{"./trackModule":3}],3:[function(require,module,exports){
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

},{"./helpers":1}]},{},[2]);
