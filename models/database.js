var redis = require('redis');
var config = require('../dbconfig');

if(!config.prefix) {
	throw new Error('The database prefix can not be blank.')
}
/*
 * Set up Database Connection
 */

var db;
var ready = false;

if(config.useDefaults) {
	db = redis.createClient();
} else {
	db = redis.createClient(config.port, config.host, config.options);
}

/*
 * Listen for Events
 */

db.on('ready', function() {
	ready = true;
});

// db.on('error', function(err) {
// 	throw new Error(err);
// });

db.on('end', function() {
	ready = false;
});

/*
 * Helper Commands
 */

function isValidId(id, callback) {
	db.get(config.prefix+':uid', function(err, maxId) {
		callback(err, id <= maxId);
	});
};

/*
 * Commands to Database
 */

var getUID = function(callback) {
	db.incr(config.prefix+':uid', callback);
};

var save = function(id, type, data, callback, tries) {
	
	if(!tries) tries = 0;

	if(typeof callback !== 'function') {
		callback = function() {};
	}

	if(tries > 10) {
		return callback('Data cannot be saved. Exceeded max tries.');
	}

	if(typeof data !== 'string') {
		try {
			data = JSON.stringify(data);
		} catch(e) {
			return callback('Data is not properly formatted.');
		}
	}

	var key = config.prefix;
	if(id) key += ':'+id;
	if(type) key += ':'+type;

	if(key === config.prefix) {
		return callback('Invalid key for database entry.');
	}

	db.set(key, data, function(err, ok) {
		if(err) return callback(err);

		if(ok === 1) {
			return callback(null, data);
		} else {
			return save(id, type, data, callback, ++tries);
		}

	});

};

var get = function(id, type, callback, tries) {
	
	if(!tries) tries = 0;

	if(typeof callback !== 'function') {
		callback = function() {};
	}

	if(tries > 10) {
		return callback('Entry does not exist.');
	}

	var key = config.prefix;
	if(id) key += ':'+id;
	if(type) key += ':'+type;

	if(key === config.prefix) {
		return callback('Invalid key for database entry.');
	}

	db.get(key, function(err, data) {
		if(err) return callback(err);

		if(data) {
			return callback(null, data);
		} else {
			return get(id, type, data, callback, ++tries);
		}
	});
};

var getAll = function(type, callback, tries) {
	
	if(!tries) tries = 0;

	if(typeof callback !== 'function') {
		callback = function() {};
	}

	if(tries > 10) {
		return callback('Entry does not exist.');
	}

	var key = config.prefix;
	if(type) key += ':*:'+type;

	if(key === config.prefix) {
		return callback('Invalid key for database entry.');
	}

	db.keys(key, function(err, keys) {
		if(err) return callback(err);

		db.mget(keys, function(err, data) {
			if(err) return callback(err);

			if(data) {
				return callback(null, data);
			} else {
				return getAll(type, data, callback, ++tries);
			}
		});
	});
};

exports.on = db.on;
exports.getUID = getUID;
exports.save = save;
exports.getAll = getAll;