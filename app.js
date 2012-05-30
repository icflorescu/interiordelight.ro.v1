/**
 * Modules & Variables
 */
var express = require('express'),
	MongoStore = require('connect-mongo')(express),
	passport = require('passport'),
	GoogleStrategy = require('passport-google').Strategy,
	config = require('./lib/config'),
	routes = require('./routes'),
	app = module.exports = express.createServer();

/**
 * Very simple Google Passport configuration
 */
passport.serializeUser(function(user, callback) {
  callback(null, user);
});

passport.deserializeUser(function(obj, callback) {
	callback(null, obj);
});

passport.use(new GoogleStrategy({
		realm: config.passport.realm,
		returnURL: config.passport.returnURL
 	},
 	function(identifier, profile, callback) {
 		var isAuthorized = profile.emails.some(function(item) {
	 			return config.passport.admins.indexOf(item.value) > -1;
 			});

 		if (isAuthorized) {
 			callback(null, profile);
 		} else {
 			callback(false);
 		}
	}
));

/**
 * Application configuration
 */
app.configure(function() {
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser());
	app.use(express.session({
		secret: config.sessionSecretKey,
		store: new MongoStore({
			url: config.databaseUrl + '/' + config.sessionDatabaseCollection
		})
	}));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(express.static(__dirname + '/public', { maxAge: config.maxCacheAge }));
	app.use(express.favicon(__dirname + '/public/images/favicon.ico', { maxAge: config.maxCacheAge }));
	app.use(app.router);
	app.use(routes.pages.error);
});

/*
app.configure('development', function() {
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function() {
	app.use(express.errorHandler());
});
*/

/**
 * Routes
 */
 // Pages
app.get('/',                   routes.pages.filterBrowser, routes.pages.adjustLanguage, routes.pages.index);
app.get('/contact',            routes.pages.filterBrowser, routes.pages.adjustLanguage, routes.pages.contact);
app.get('/portfolio',          routes.pages.filterBrowser, routes.pages.adjustLanguage, routes.pages.portfolio);
app.get('/portfolio/:project', routes.pages.filterBrowser, routes.pages.adjustLanguage, routes.pages.project);

app.get('/admin',              routes.pages.admin);

// Authentication
app.get('/login', passport.authenticate('google', { failureRedirect: '/' }), function(req, res) {
	res.redirect('/admin');
});
app.get('/login/return', passport.authenticate('google', { failureRedirect: '/' }), function(req, res) {
	res.redirect('/admin');
});
app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

// API
app.get( '/api/projects',      routes.api.checkAuthentication, routes.api.projects.browse);
app.post('/api/projects',      routes.api.checkAuthentication, routes.api.projects.create)
app.get( '/api/projects/:id',  routes.api.checkAuthentication, routes.api.projects.read);
app.put( '/api/projects/:id',  routes.api.checkAuthentication, routes.api.projects.update)
app.del( '/api/projects/:id',  routes.api.checkAuthentication, routes.api.projects.destroy);

app.get( '/api/gallery/:id',   routes.api.checkAuthentication, routes.api.gallery.read);
app.put( '/api/gallery/:id',   routes.api.checkAuthentication, routes.api.gallery.update);

// Catch-All
app.get('*', function(req, res, next) {
	next(new Error(404));
});

/**
 * Start Server
 */
app.listen(config.port, function() {
	console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
