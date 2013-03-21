App.View.ProjectList = Backbone.View.extend({
	el: '#project-list',

	initialize: function() {
		var me = this;

		me.options.eventBus.on('projectchanged', me.onProjectChanged, me);
		me.collection.on('sync', me.render, me);
		me.collection.fetch();
	},

	render: function() {
		var me = this,
			$container = $('.items', me.$el);

		$container.empty();
		me.collection.each(function(item) {
			$('<a/>', {
				class: (item.id === me.currentProjectId ? 'project current' : 'project'),
				href: '#project:' + item.id,
				text: item.get('content.en.title'),
			}).appendTo($container);
		});
	},

	events: {
		'click a.project'      : 'loadProject',
		'click button.btn-add' : 'newProject'
	},

	loadProject: function(e) {
		var $el = $(e.target),
			link = $el.attr('href'),
			id = link.substring(link.lastIndexOf(':') + 1);

		this.options.eventBus.trigger('loadproject', id);
		e.preventDefault();
	},

	newProject: function() {
		this.currentProjectId = null;
		this.render();
		this.options.eventBus.trigger('newproject');
	},

	onProjectChanged: function(id) {
		this.currentProjectId = id;
		this.collection.fetch();
	}
});
