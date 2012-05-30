App.Collection.Projects = Backbone.Collection.extend({
	model: App.Model.Generic,
	url: '/api/projects'
});
