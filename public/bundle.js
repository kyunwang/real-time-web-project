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

exports.createNode = function(element = 'li', text = '', className, idName, dataAttr) {
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

	if (dataAttr) {
		node.setAttribute('data', dataAttr);
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

},{}],2:[function(require,module,exports){
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

},{"./helpers":1}]},{},[2]);
