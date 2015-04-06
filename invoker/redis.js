
var redis = require('redis'),
	Q = require('q'),
	url = require('url');

function RedisInvoker(opts) {
	opts = opts || {};
	this.queue = opts.queue || 'default-queue';
	if (opts.redis) {
		if (typeof opts.redis == 'string') {
			var parsed = url.parse(opts.redis);
			opts.redis = {
				host: parsed.hostname,
				port: +parsed.port
			};
		}
		this.redis = redis.createClient(opts.redis.port, opts.redis.host, opts.redis.options || {});
	} else {
		this.redis = redis.createClient();
	}
}

RedisInvoker.prototype.invoke = function(fn, args, cb) {
	var defer = Q.defer();
	if (fn) {
		this.redis.lpush(this.queue, JSON.stringify({
			date: Date.now(),
			fn: fn,
			args: args
		}), defer.makeNodeResolver());
	} else {
		defer.reject(new Error('Function name not specified'));
	}
	defer.promise.nodeify(cb);
	return defer.promise;
};

exports = module.exports = RedisInvoker;