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

exports.topMenu = [
	{ slug: '/', title: 'New releases' },
	{ slug: '/featured', title: 'Featured' },
	// { slug: '/map', title: 'Map' },
];

},{}],2:[function(require,module,exports){
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
			socket.on('removeTrack', this.removeTrack);

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
		removeTrack: function(trackId) {
			// This didn't work
			// const track = $(`#${trackId}`);
			const track = document.getElementById(trackId);
			track.remove();
		},
	};

	const playlist = {
		addButtons: [],
		removeButtons: [],
		init: function() {
			this.addButtons = $$('.track__add');
			this.removeButtons = $$('.track__remove');

			addEvent('click', this.addButtons, playlist.addTrack);
			addEvent('click', this.removeButtons, playlist.removeTrack);
		},
		addTrack: function(e) {
			const trackId = this.dataset.trackId;
			socket.emit('addTrack', trackId);
		},
		removeTrack: function(e) {
			const trackId = this.dataset.trackId;
			socket.emit('removeTrack', trackId);
		},
	};

	playlist.init();

	room.init();
})();

},{"./helpers":1}]},{},[2]);
