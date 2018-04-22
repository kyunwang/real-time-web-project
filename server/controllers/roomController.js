exports.showRooms = (req, res) => {
	res.render('roomSelect', {});
};

exports.roomForm = (req, res) => {
	res.render('newRoomForm', {});
};
