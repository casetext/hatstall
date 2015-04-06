var Q = require('q');

function ConsoleInvoker(opts) {
	opts = opts || {};
}

ConsoleInvoker.prototype.invoke = function(fn, args, cb) {
	var defer = Q.defer();
	if (fn) {
		console.log('invoke', fn, args);
		defer.resolve();
	} else {
		defer.reject(new Error('Function name not specified'));
	}
	defer.promise.nodeify(cb);
	return defer.promise;
};

exports = module.exports = ConsoleInvoker;