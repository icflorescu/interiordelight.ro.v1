$(function() {
	// Apply NivoSlider
	$('#slider').nivoSlider({
		effect: 'fade',
		pauseTime: 5000
	});

	// Apply FancyBox
	$('.fancybox').fancybox({
		openEffect: 'elastic',
		closeEffect: 'elastic',
		prevEffect: 'fade',
		nextEffect: 'fade'
	});

	// Portfolio page - apply hover effect on project link images
	$('#portfolio a').on({
		mouseenter: function() {
			$('.info', this).stop().fadeTo(100, 0.75);
		},
		mouseleave: function() {
			$('.info', this).stop().fadeTo(500, 0.00);
		}
	});

	// Project page - add 2-cols class on large description tokens
	$('article.project-description').each(function(index, token) {
		var $token = $(token);
		console.log($token.height());
		if($token.height() > 100) {
			$token.addClass('cols');
		}
	});

	// Scroll to top footer link
	$('#footer-nav .top').click(function(e) {
		$('body,html').animate({
			scrollTop: 0
		}, 'slow');
		e.preventDefault();
	});
});
