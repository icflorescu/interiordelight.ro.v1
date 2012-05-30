App.Collection.PicasaProjectAlbums = Backbone.Collection.extend({
	url: function() {
		return 'http://picasaweb.google.com/data/feed/api/user/' +
			   App.Configuration.picasa.userId +
			   '?alt=json&fields=entry(gphoto:id,title,published)' +
			   '&uid=' + (new Date).getTime();
	},

	parse: function(response) {
		var items = [],
			matches;
		_.each(response.feed.entry, function(item) {
			matches = /^\[project\]\s*(.*)$/i.exec(item.title.$t.trim());
			if (matches) {
				items.push({
					id: item.gphoto$id.$t,
					title: matches[1],
					date: item.published.$t
				});
			}
		});
		return items;
	}
});
