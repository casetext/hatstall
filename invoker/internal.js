var Q = require('q');

function InternalInvoker(opts) {
	if (!opts || !opts.locavore || typeof opts.locavore.invoke != 'function') {
		throw new Error('Must supply a locavore instance.');
	}
	this.locavore = opts.locavore;
}

InternalInvoker.prototype.invoke = function(fn, args, cb) {
	var defer = Q.defer();
	
	this.locavore.invoke(fn, args, defer.makeNodeResolver());

	defer.promise.nodeify(cb);
	return defer.promise;
};

exports = module.exports = InternalInvoker;