var url = require('url'),
	aws4 = require('aws4'),
	request = require('request');


function LambdaInvoker(opts) {
	opts = opts || {};
	this.agentPool = {
		maxSockets: 512
	};
	if (opts.host) {
		this.host = opts.host;
	} else {
		this.host = 'http://localhost:3033';
		if (process.env.NODE_ENV == 'production') {
			this.host = 'https://lambda.us-east-1.amazonaws.com';
		}
	}
	this.prefix = opts.prefix || '';
}


LambdaInvoker.prototype.invoke = function(fn, args, cb) {
	var self = this, tries = 0;
	args = JSON.stringify(args);

	function tryInvoke() {
		var path = '/2014-11-13/functions/' + self.prefix + fn + '/invoke-async/',
			signature = aws4.sign({
				host: url.parse(self.host).host,
				method: 'POST',
				path: path,
				headers: {
					'Content-Type': 'application/json; charset=utf-8'
				},
				body: args
			});


		request({
			method: 'POST',
			url: self.host + path,
			body: args,
			pool: self.agentPool,
			headers: signature.headers
		}, function(err, res, body) {
			if (err) {
				failed(err);
			} else if (res.statusCode != 202) {
				failed(new Error('Invoke error ' + res.statusCode));
			} else {
				if (cb) {
					cb();
				}
			}
		});
	}

	function failed(err) {
		if (tries++ > 3) {
			if (cb) {
				cb(err);
			}
		} else {
			setTimeout(tryInvoke, Math.pow(2, tries) * 1000);
		}
	}

	tryInvoke();
};

exports = module.exports = LambdaInvoker;