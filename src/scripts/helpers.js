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
