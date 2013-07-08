process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.TEST_ENV = process.env.TEST_ENV || 'development';

var exit = process.exit;
process.exit = function (code) {
	setTimeout(function () {
		exit();
	}, 200);
};

require('./app');
require('./node_modules/mocha/bin/_mocha');