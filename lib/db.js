var config = require('./config'),
	db = require('mongojs').connect(
		config.databaseUrl, ['projects', 'gallery'],
		{ auto_reconnect: true }
	);

/**
 * Get single-instance database connection.
 */
exports.instance = function() {
	return db;
}
