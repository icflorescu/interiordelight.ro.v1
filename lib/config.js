config = {
	port: process.env.PORT || 3000, // application port
	maxCacheAge: 3600000,           // cache assets for one hour
	defaultLanguage: 'en',          // default application language
	passport: {
		clientId:     process.env.GOOGLE_AUTH_CLIENT_ID,
		clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
		callbackURL:  process.env.GOOGLE_AUTH_CALLBACK_URL,
		admins:       process.env.ADMINS.split(',')
	},
	databaseUrl: process.env.MONGODB_URI,
	sessionSecretKey: process.env.SESSION_SECRET_KEY,
	sessionClearInterval: 10800, // clear expired session data once every 3 hrs
	picasa: {
		userId:         process.env.PICASA_USER_ID,
		galleryAlbumId: process.env.PICASA_GALLERY_ALBUM_ID,
	},
	facebookAdmins: process.env.FACEBOOK_ADMINS // for facebook's "Like" button
};

module.exports = config;
