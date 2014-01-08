var _ = require('underscore');
var request = require('request');
var ObjectId = require('mongojs').ObjectId;
var config = require('../../config');
var db = require('../db')(config);

exports.createOrUpdate = function (network, callback) {
	db.networks.update(
		{user: network.user, service: network.service},
		{$set: network, $unset: {disabled: ''}},
		{safe: true, upsert: true, 'new': true},
		callback);
};

exports.removeNetwork = function (user, service, callback) {
	db.networks.remove({ user: user, service: service }, function (err) {
		if (err) {
			return callback(err);
		}

		callback(null);
	});
};

exports.findNetworks = function (user, callback) {
	var nets = [];
	var fieldsToPick = ['service', 'lastExecution', 'disabled'];

	db.networks.find({ user: user }).forEach(function (err, doc) {
		if (err) {
			return callback(err);
		}

		if (!doc) {
			return callback(null, nets);
		}

		var network = _.pick(doc, fieldsToPick);
		network.id = doc._id.toString();
		nets.push(network);
	});
};

exports.enable = function (id, callback) {
	db.networks.update({_id: new ObjectId(id)}, { disabled: '' }, callback);
};

exports.getDribbbleUser = function (username, callback) {
	if (!username || typeof username !== 'string') {
		return callback({ message: 'username is invalid' });
	}

	username = username.toLowerCase();

	request('http://api.dribbble.com/players/' + username, function (err, resp, body) {
		if (err) {
			return callback(err);
		}

		if (resp.statusCode === 404) {
			getScout();
		} else {
			callback(null, JSON.parse(body));
		}

	});

	function getScout() {
		request('http://dribbble.com/' + username, function (err, resp, page) {
			if (err) {
				return callback(err);
			}

			if (resp.statusCode !== 200) {
				return callback({ message: 'scout not found'});
			}

			callback(null, { name: username });
		});
	}
};
