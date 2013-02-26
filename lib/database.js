var connection = require('mongojs').connect(
		require('./config').databaseUrl, ['projects', 'gallery'],
		{ auto_reconnect: true }
	);

/**
 * Get single-instance database connection.
 */
exports.connection = function() {
	return connection;
};
