App.View.Gallery = Backbone.View.extend({
	el: '#gallery',

	initialize: function() {
		var me = this;

		_.bindAll(me, 'render');
		me.model.on('change', me.showPicture, me);

		me.currentPictureIndex = 0;
		me.model.set('id', 1);
		me.model.fetch({
			success: me.render,
			error: function() {
				me.options.eventBus.trigger('message', 'error', 'Cannot load gallery!');
			}
		});
	},

	events: {
		'click button.btn-refresh' : 'refresh',
		'click button.btn-prev'    : 'prev',
		'click button.btn-next'    : 'next',
	},

	refresh: function() {
		var me = this,
			eventBus = me.options.eventBus,
			pictures = new App.Collection.PicasaAlbumPictures([], {
				albumId: App.Configuration.picasa.galleryAlbumId
			});

		eventBus.trigger('message', 'start');
		pictures.fetch({
			success: function() {
				me.model.set('pictures', pictures.models.map(function(item) {
					return item.attributes;
				}));
				me.model.save(null, {
					success: function() {
						eventBus.trigger('message', 'success');
						me.currentPictureIndex = 0;
						me.render();
					},
					error: function() {
						eventBus.trigger('message', 'error', 'Cannot save gallery!');
					}
				});
			},
			error: function() {
				eventBus.trigger('message', 'error', 'Cannot get pictures from Picasa!');
			}
		});
	},

	prev: function() {
		this.currentPictureIndex--;
		this.render();
	},

	next: function() {
		this.currentPictureIndex++;
		this.render();
	},

	render: function() {
		var me = this,
			pictureCount = me.model.get('pictures').length,
			currentPicture = pictureCount ? me.model.get('pictures')[me.currentPictureIndex] : null,
			currentPictureUrl = pictureCount ?
				currentPicture.urlPrefix + '/s220/' + currentPicture.fileName :
				'/images/admin-gallery-img-empty.png',
			currentPictureText = pictureCount ?
				'[' + (me.currentPictureIndex + 1) + ' of ' + pictureCount + ']' :
				'[no pictures]',
			$btnPrev = $('button.btn-prev', me.$el),
			$btnNext = $('button.btn-next', me.$el);

		if (!(pictureCount) || me.currentPictureIndex === 0) {
			$btnPrev.attr('disabled', 'disabled');
		} else {
			$btnPrev.removeAttr('disabled');
		}

		if (!(pictureCount) || me.currentPictureIndex === (pictureCount - 1)) {
			$btnNext.attr('disabled', 'disabled');
		} else {
			$btnNext.removeAttr('disabled');
		}

		$('.picture-content', me.$el)
			.css('background-image', 'url(\'' + currentPictureUrl + '\')')
			.text(currentPictureText);
	}

});
