App.View.MessageBox = Backbone.View.extend({
	el: '#message-box',

	initialize: function() {
		var me = this;

		_.bindAll(me, 'show');
		me.options.eventBus.on('message', me.show, me);
	},

	show: function(type, text) {
		var $window = $(window),
			$el = this.$el;

		if (type == 'start') {
			text = 'Please wait...';
		}

		if (type == 'success' && text == null) {
			$el.stop().fadeOut('fast');
		} else {
			$('.inner', $el).text(text);
			$el.stop().attr('class', type).css({
				left: ($window.width() - $el.outerWidth(true)) / 2 + 'px',
				display: 'block'
			});
		}
	},

	events: {
		'click' : function() {
			if (!(this.$el.hasClass('start'))) {
				this.$el.fadeOut('fast');
			}
		}
	}
});
