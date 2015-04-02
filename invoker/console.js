
function ConsoleInvoker(opts) {
	opts = opts || {};
}

ConsoleInvoker.prototype.invoke = function(fn, args, cb) {
	if (fn) {
		console.log('invoke', fn, args);
		if (cb) {
			cb();
		}
	} else {
		if (cb) {
			cb(new Error('Function name not specified'));
		}
	}
};

exports = module.exports = ConsoleInvoker;