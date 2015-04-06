var url = require('url');

exports.run = function(fn, deleteAfter) {
	var self = this;
	return function(snap) {
		var path = url.parse(snap.ref().toString()).pathname;
		path = path.substr(0, path.length - snap.key().length - 1);
		return self.invoke(fn, {
			key: snap.key(),
			path: path,
			data: snap.val()
		}, function(err) {
			if (!err && deleteAfter) {
				snap.ref().set(null);
			}
		});
	};
};

exports.trigger = function(fn) {
	return exports.run.call(this, fn, true);
};

exports.responder = function(fn) {
	var self = this;
	return function(snap) {
		var path = url.parse(snap.ref().toString()).pathname;
		// we only want the portion of the path of before the /request/<id>
		path = path.substr(0, path.lastIndexOf('/', path.length - snap.key().length - 2));
		return self.invoke(fn, {
			key: snap.key(),
			path: path,
			data: snap.val()
		}, function(err) {
			if (!err) {
				snap.ref().set(null);
			}
		});
	};
};

exports.job = function(fn, args) {
	var self = this;
	return function() {
		return self.invoke(fn, args || {});
	};
};