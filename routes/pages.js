var async = require('async'),
	config = require('../lib/config'),
	db = require('../lib/db').instance(),
	assetSuffix = process.env.NODE_ENV === 'production' ? '.min' : '';
	i18n = require('../lib/i18n'),
	adjuster = require('../lib/content-adjuster');

// Filter IE < 8 browsers
exports.filterBrowser = function(req, res, next) {
	var userAgent, ieIndex, ieVersion;

	// only check once per session
	if (!(req.session.hasOwnProperty('browserOk'))) {
		userAgent = req.headers['user-agent'];
		ieIndex = userAgent.indexOf('MSIE');
		if (ieIndex == -1) {
			req.session.browserOk = true;
		} else {
			try {
				ieVersion = parseInt(userAgent.substring(ieIndex + 5, ieIndex + 6), 10);
				req.session.browserOk = (ieVersion > 7);
			} catch (err) {
				req.session.browserOk = true;
			}
		}
	}

	if (req.session.browserOk) {
		next();
	} else {
		res.render('unsupported', { layout: false });
	}
};

// Adjust session language if necessary
exports.adjustLanguage = function(req, res, next) {
	if (req.param('lang')) {
		req.session.lang = req.param('lang');
	} else {
		if (!(req.session.lang)) {
			req.session.lang = config.defaultLanguage;
		}
	}
	next();
};

// Home page
exports.index = function(req, res, next) {
	var lang = req.session.lang;

	async.series([

		// fetch gallery images
		function(callback) {
			var fields = {
					urlPrefix: 1,
					fileName: 1
				};

			fields['title.' + lang] = 1;

			db.gallery.find({}, fields).sort({ priority: 1 }, callback);
		},

		// fetch last project
		function(callback) {
			var fields = {
					urlSuffix: 1,
					// first 3 pictures only
					contentPictures: { $slice: 3 },
					'contentPictures.urlPrefix': 1,
					'contentPictures.fileName': 1
				};

			// fetch content in current language only
			fields['content.' + lang] = 1;
			fields['contentPictures.title.' + lang] = 1;

			db.projects.find({}, fields).sort({ date: -1 }).limit(1, callback);
		}

	], function(err, results) {
		var gallery, latestWork;

		if (err) {
			next(err);
		} else {
			gallery     = results[0];
			lastProject = results[1][0];

			if (lastProject) {
				// adjust content
				adjuster.intro(lastProject, lang);

				// render page
				res.render('index', {
					title: 'Intro',
					css: 'index',
					assetSuffix: assetSuffix,
					i18n: i18n,
					lang: lang,

					gallery: gallery,
					lastProject: lastProject
				});
			} else {
				// no results - database is empty
				next(new Error(404));
			}
		}
	});
};

// Contact page
exports.contact = function(req, res, next) {
	res.render('contact', {
		title: 'Contact',
		css: 'contact',
		assetSuffix: assetSuffix,
		i18n: i18n,
		lang: req.session.lang
	});
};

// Portfolio page
exports.portfolio = function(req, res, next) {
	var lang = req.session.lang,
		fields = {
			urlSuffix: 1,
			coverPicture: 1,
			date: 1
		};

	// fetch content in current language only
	fields['content.' + lang + '.title'] = 1;

	db.projects.find({}, fields).sort({ date: -1 }, function(err, results) {
		if (err) {
			next(err);
		} else {
			// render page
			res.render('portfolio', {
				title: i18n['Portfolio'][lang],
				css: 'portfolio',
				assetSuffix: assetSuffix,
				i18n: i18n,
				lang: lang,

				projects: results
			});
		}
	});
};

// Project page
exports.project = function(req, res, next) {
	var lang = req.session.lang,
		fields = {
			date: 1,
			'contentPictures.urlPrefix': 1,
			'contentPictures.fileName': 1
		};

	// fetch content in current language only
	fields['contentPictures.title.' + lang] = 1;
	fields['content.' + lang] = 1;

	db.projects.findOne({ urlSuffix: req.params.project }, fields, function(err, result) {
		if (err) {
			next(err);
		} else if (result === null) {
			// no results - must be an outdated link
			next(new Error(404));
		} else {
			// adjust content
			adjuster.project(result, lang);

			// render page
			res.render('project', {
				title: result.content[lang].title + ' : ' +
				       result.date.toJSON().substring(5,7) + '/' + result.date.getFullYear(),
				css: 'project',
				assetSuffix: assetSuffix,
				i18n: i18n,
				lang: lang,

				project: result
			});
		}
	});
};

// Admin page
exports.admin = function(req, res, next) {
 	if (req.isAuthenticated()) {
		res.render('admin', {
			layout: false,
			picasaConfig: config.picasa,
			assetSuffix: assetSuffix
		});
 	} else {
 		res.redirect('/login');
 	}
};

// Error page
exports.error = function(err, req, res, next) {
	var lang = req.session.lang,
		status = (err.message == '404' ? 404 : 500);

	console.log((new Date), err, req.url);

	res.status(status);
	res.render('error', {
		title: i18n['Oops! It seems we have a problem...'][lang],
		css: 'error',
		assetSuffix: assetSuffix,
		i18n: i18n,
		lang: lang,
		status: status
	});
};
