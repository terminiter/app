var analytics = require('../utils/analytics');
var logger = require('../utils/logger');

function track(event, options) {
	return function (req, res, next) {
		var data = {};

		if (options && options.param) {
			data[options.param] = req.params[options.param];
		}

		if (options && options.query) {
			data[options.query] = req.query[options.query];
		}

		analytics(event, data, function (err) {
			if (err) {
				logger.error({message: 'analytics event post error', err: err});
			}
		});

		next();
	};
}

module.exports = {
	track: track
};