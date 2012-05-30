App.View.ProjectEditor = Backbone.View.extend({
	el: '#project-editor',

	initialize: function() {
		var me = this;

		me.contentPicsTmpl = _.template($('#content-pics-tmpl').html());

		_.bindAll(me,
			'updateForm', 'updateModel', 'clearPictures', 'showPictures', 'startNewProject'
		);

		me.options.eventBus.on('newproject',  me.startNewProject, me);
		me.options.eventBus.on('loadproject', me.loadProject,     me);
	},

	events: {
		'click button.btn-save'     : 'saveProject',
		'click button.btn-delete'   : 'deleteProject',
		'click button.btn-pictures' : 'reloadPictures',
	},

	updateForm: function() {
		var model = this.model;

		$('.title span', this.$el).text('Editing ' +
			(model.isNew() ? 'new project' : 'project: ' + model.get('content.en.title'))
		);

		$('#title-en')
			.val(model.get('content.en.title'))
			.toggleClass('error', model.get('content.en.title') === '');

		$('#description-en')
			.val(model.get('content.en.description'))
			.toggleClass('error', model.get('content.en.description') === '');

		$('#title-ro')
			.val(model.get('content.ro.title'))
			.toggleClass('error', model.get('content.ro.title') === '');

		$('#description-ro')
			.val(model.get('content.ro.description'))
			.toggleClass('error', model.get('content.ro.description') === '');

		$('.btn-delete', this.$el).css('display', model.isNew() ? 'none' : 'block');
	},

	updateModel: function() {
		this.model.set({
			'content.en.title':       $('#title-en').val().trim(),
			'content.en.description': $('#description-en').val().trim(),
			'content.ro.title':       $('#title-ro').val().trim(),
			'content.ro.description': $('#description-ro').val().trim()
		});
	},

	clearPictures: function() {
		$('.cover-picture .picture-content', this.$el).css(
			'background-image', 'url(\'/images/admin-project-img-empty.png\')'
		);

		$('.content-pictures', this.$el).empty();
	},

	showPictures: function() {
		var me = this,
			model = me.model,
			$contentPictures = $('.content-pictures', me.$el);

		if (model.has('coverPicture')) {
			$('.cover-picture .picture-content', me.$el).css('background-image',
				'url(\'' + model.get('coverPicture.urlPrefix') + '/s100-c/' + model.get('coverPicture.fileName') + '\')'
			);
		}

		if (model.has('contentPictures')) {
			_.each(model.get('contentPictures'), function(item, index) {
				$contentPictures.append(me.contentPicsTmpl({
					urlPrefix: item.urlPrefix,
					fileName: item.fileName,
					number: index + 1
				}));
			});
		}
	},

	startNewProject: function() {
		var me = this;

		me.model.clear();
		me.updateForm();
		me.clearPictures();
		$('#title-en', me.$el).focus();
	},

	loadProject: function(id) {
		var me = this,
			eventBus = me.options.eventBus;

		me.model.clear();
		me.updateForm();
		me.clearPictures();
		me.model.set('_id', id);
		eventBus.trigger('message', 'start');
		me.model.fetch({
			success: function() {
				me.updateForm();
				me.showPictures();
				eventBus.trigger('message', 'success');
				eventBus.trigger('projectchanged', me.model.id);
			},
			error: function() {
				eventBus.trigger('message', 'error', 'Cannot load project!');
			}
		});
	},

	saveProject: function() {
		var me = this,
			eventBus = me.options.eventBus;

		me.updateModel();
		if (me.model.get('content.en.title') == '') {
			eventBus.trigger('message', 'error', 'English title cannot be empty!');
		} else {
			me.model.set('urlSuffix', me.model.get('content.en.title').replace(/[^\w]+/g, '_').toLowerCase());
			eventBus.trigger('message', 'start');
			me.model.save(null, {
				success: function() {
					me.updateForm();
					eventBus.trigger('message', 'success');
					eventBus.trigger('projectchanged', me.model.id);
				},
				error: function() {
					eventBus.trigger('message', 'error', 'Cannot save project!');
				}
			});
		}
	},

	deleteProject: function() {
		var me = this,
			eventBus = me.options.eventBus;

		eventBus.trigger('message', 'start');
		me.model.destroy({
			success: function() {
				me.startNewProject();
				eventBus.trigger('message', 'success');
				eventBus.trigger('projectchanged');
			},
			error: function() {
				eventBus.trigger('message', 'error', 'Cannot delete project!');
			}
		});
	},

	reloadPictures: function() {
		var me = this,
			eventBus = me.options.eventBus,
			albums = new App.Collection.PicasaProjectAlbums,
			projectAlbum, pictures;

		me.clearPictures();
		me.updateModel();

		if (me.model.get('content.en.title') === '') {
			eventBus.trigger('message', 'error', 'Need English title to load pictures!');
		} else {
			eventBus.trigger('message', 'start');

			albums.fetch({
				success: function() {
					projectAlbum = albums.find(function(album) {
						return album.get('title').toLowerCase() === me.model.get('content.en.title').toLowerCase();
					});

					if (!(projectAlbum)) {
						eventBus.trigger('message', 'error', 'No matching album found on Picasa!');
					} else {
						me.model.set('date', projectAlbum.get('date'));
						pictures = new App.Collection.PicasaAlbumPictures([], { albumId: projectAlbum.id });
						pictures.fetch({
							success: function() {
								var coverPicture = pictures.shift();

								me.model.set('coverPicture', {
									urlPrefix: coverPicture.get('urlPrefix'),
									fileName:  coverPicture.get('fileName')
								});
								me.model.set('contentPictures', pictures.map(function(item) {
									return item.attributes;
								}));

								eventBus.trigger('message', 'success');
								me.showPictures();
							},
							error: function() {
								eventBus.trigger('message', 'error', 'Cannot reload pictures!');
							}
						});
					}
				},
				error: function() {
					eventBus.trigger('message', 'error', 'Cannot reload pictures!');
				}
			});
		}
	}
});
