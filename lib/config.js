module.exports = {
	port: process.env.PORT || 3000, // application port
	maxCacheAge: 3600000, // cache assets for one hour
	defaultLanguage: 'en', // default application language
	passport: {
		realm: process.env.APP_URL || 'http://ionut.dyndns.biz',
		returnURL: (process.env.APP_URL || 'http://ionut.dyndns.biz') + '/login/return',
		admins: [
			'ionut.florescu@gmail.com', 'irinel.florescu@gmail.com'
		]
	},
	databaseUrl: process.env.MONGOLAB_URI || '127.0.0.1/interiordelight',
	sessionSecretKey: 'KGJgikL:ghj$%^lkjBKJ($%^nklBJK345GHFw345',
	sessionDatabaseCollection: 'sessions',
	picasa: {
		userId:         '102692237034378144721',
		galleryAlbumId: '5744380204398479441'
	}
};
