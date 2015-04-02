
var redis = require('redis');

function RedisInvoker(opts) {
	opts = opts || {};
	this.queue = opts.queue || 'default-queue';
	if (opts.redis) {
		this.redis = redis.createClient(opts.redis.port, opts.redis.host, opts.redis.options || {});
	} else {
		this.redis = redis.createClient();
	}
}

RedisInvoker.prototype.invoke = function(fn, args, cb) {
	if (fn) {
		this.redis.lpush(this.queue, JSON.stringify({
			date: Date.now(),
			fn: fn,
			args: args
		}), function(err) {
			if (cb) {
				cb(err);
			}
		});
	} else {
		if (cb) {
			cb(new Error('Function name not specified'));
		}
	}
};

exports = module.exports = RedisInvoker;