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
const player = require('./player');

player.startPlayer();

},{"./player":3}],3:[function(require,module,exports){
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

},{"./helpers":1}]},{},[2]);
