$(function() {
	var app = App.instance;

	app.adjustLayout = function() {
		$('body').css({ height: $(window).height() });
	};

	$(window).resize(_.throttle(app.adjustLayout, 200));
	app.adjustLayout();

	// initialize application-wide event bus
	app.eventBus = _.extend({}, Backbone.Events);

	// initialize models & collections
	app.projects = new App.Collection.Projects;
	app.currentProject = new App.Model.Project;
	app.gallery = new App.Model.Gallery;

	// initialize views

	app.projectListView = new App.View.ProjectList({
		collection: app.projects,
		eventBus: app.eventBus
	});

	app.projectEditorView = new App.View.ProjectEditor({
		model: app.currentProject,
		eventBus: app.eventBus
	});

	app.galleryView = new App.View.Gallery({
		model: app.gallery,
		eventBus: app.eventBus
	});

	app.messageBox = new App.View.MessageBox({
		eventBus: app.eventBus
	});

	// start a new project
	app.eventBus.trigger('newproject');
});
