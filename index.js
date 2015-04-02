
exports = module.exports = function(invoker, opts) {
	var ctor;

	if (typeof invoker == 'string') {
		ctor = require('./invoker/' + invoker);
	} else if (typeof invoker == 'function') {
		ctor = invoker;
	} else {
		throw new Error('Invalid invoker');
	}

	var runs = require('./run');
	for (var k in runs) {
		ctor.prototype[k] = runs[k];
	}

	return new ctor(opts);
};