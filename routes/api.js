var async = require('async'),
	db = require('../lib/db').instance();

exports.projects = {
	browse: function(req, res) {
		db.projects.find({}, { 'content.en.title': 1 }).sort({ date: -1 }, function(err, projects) {
			if (err) {
				res.send(500);
			} else {
				res.json(projects);
			}
		});
	},

	create: function(req, res) {
		req.body.date = new Date(req.body.date);
		db.projects.insert(req.body, function(err, projects) {
			if (err) {
				res.send(500);
			} else {
				res.json(projects[0]);
			}
		});
	},

	read: function(req, res) {
		db.projects.findOne({ _id: db.ObjectId(req.params.id) }, function(err, project) {
			if (err) {
				res.send(500);
			} else {
				res.json(project);
			}
		});
	},

	update: function(req, res) {
		req.body._id = db.ObjectId(req.params.id);
		req.body.date = new Date(req.body.date);
		db.projects.update({ _id: req.body._id }, req.body, { safe: true }, function(err, count) {
			if (err || count !== 1) {
				res.send(500);
			} else {
				res.json(req.body);
			}
		});
	},

	destroy: function(req, res) {
		db.projects.remove({ _id: db.ObjectId(req.params.id) }, function(err) {
			if (err) {
				res.send(500);
			} else {
				res.send();
			}
		});
	}
};

exports.gallery = {
	read: function(req, res) {
		var gallery;

		db.gallery.find().sort({ priority: 1 }, function(err, pictures) {
			if (err) {
				res.send(500);
			} else {
				gallery = { pictures: pictures };
				res.json(gallery);
			}
		});
	},

	update: function(req, res) {
		async.series([
			function(callback) {
				db.gallery.remove({}, callback);
			},
			function(callback) {
				req.body.pictures.forEach(function(picture, index) {
					picture.priority = index;
				});
				async.map(req.body.pictures, function(picture, callback) {
					db.gallery.insert(picture, callback);
				}, callback);
			}
		], function(err, results) {
			if (err) {
				res.send(500);
			} else {
				res.send(req.body);
			}
		});
	}
};

exports.checkAuthentication = function(req, res, next) {
 	if (req.isAuthenticated()) {
 		return next();
 	} else {
 		res.send(401);
 	}
};
