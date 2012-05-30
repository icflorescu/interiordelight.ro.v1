App.Collection.PicasaAlbumPictures = Backbone.Collection.extend({
	model: Backbone.DeepModel,

	initialize: function(models, options) {
		this.albumId = options.albumId;
	},

	url: function() {
		return 'http://picasaweb.google.com/data/feed/api/user/' +
			   App.Configuration.picasa.userId +
			   '/albumid/' +
			   this.albumId +
			   '?alt=json&fields=entry(summary,content)' +
			   '&uid=' + (new Date).getTime();
	},

	parse: function(response) {
		var url, idx, matches;

		return _.map(response.feed.entry, function(item) {
			url = item.content.src,
			idx = url.lastIndexOf('/');
			matches = /\[en\]\s*(.+?)\s*\[ro\]\s*(.+)/i.exec(item.summary.$t.trim());

			return {
				urlPrefix: url.substring(0, idx),
				fileName: url.substring(idx + 1),
				title: {
					en: matches ? matches[1] : null,
					ro: matches ? matches[2] : null
				}
			};
		});
	}
});
