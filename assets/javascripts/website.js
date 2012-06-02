//////////////////////////////////////////////////////////////////////////////////////////// Initialize Google +1 button

(function() {
	var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
	po.src = 'https://apis.google.com/js/plusone.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
})();

////////////////////////////////////////////////////////////////////////////////////// Initilaize Facebook "Like" button

(function(d, s, id) {
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) return;
	js = d.createElement(s); js.id = id;
	js.src = "//connect.facebook.net/en_US/all.js#xfbml=1";
	fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

////////////////////////////////////////////////////////////////////////////////////////////////////// On document ready

$(function() {
	// Apply NivoSlider
	$('#slider').nivoSlider({
		effect: 'fade',
		pauseTime: 5000
	});

	///////////////////////////////////////////////////////////// Apply FancyBox

	$('.fancybox').fancybox({
		openEffect: 'elastic',
		closeEffect: 'elastic',
		prevEffect: 'fade',
		nextEffect: 'fade'
	});

	///////////////// Portfolio page - apply hover effect on project link images

	$('#portfolio a').on({
		mouseenter: function() {
			$('.info', this).stop().fadeTo(100, 0.75);
		},
		mouseleave: function() {
			$('.info', this).stop().fadeTo(500, 0.00);
		}
	});

	//////////////// Project page - add 2-cols class on large description tokens

	$('article.project-description').each(function(index, token) {
		var $token = $(token);
		console.log($token.height());
		if($token.height() > 100) {
			$token.addClass('cols');
		}
	});

	/////////////////////////////////// Slow scroll to top effect on footer link

	$('#footer-nav .top').click(function(e) {
		$('body,html').animate({
			scrollTop: 0
		}, 'slow');
		e.preventDefault();
	});

	////////////////////// On windows loaded, position "spread the word" element

	$(window).load(function() {
		var right;

		// act depending on 'spread-the-word-hidden' cookie (true/non-existent)
		if ($.cookie('spread-the-word-hidden')) {
			$('#spread-the-word .collapse').hide();
			$('#spread-the-word .content').hide();
			$('#spread-the-word .expand').css({ display: 'block' });
			right = -45;
		} else {
			$('#spread-the-word .collapse').show();
			$('#spread-the-word .content').show();
			$('#spread-the-word .expand').css({ display: 'none' });
			right = 0;
		}

		$('#spread-the-word').css({
			top: $('section.box').first().offset().top + 1 + 'px'
		}).animate({ right: right });
	});

	///////////////////////////////////////////////// Collapse "spread the word"

	$('#spread-the-word .collapse').click(function(e) {
		$('#spread-the-word').stop().animate({ right: -70 }, 'fast', function() {
			$('#spread-the-word .collapse').hide();
			$('#spread-the-word .content').hide();
			$('#spread-the-word .expand').css({ display: 'block' });
			$('#spread-the-word').animate({ right: -45 });
		});
		// remember state
		$.cookie('spread-the-word-hidden', true, { path: '/' });
		e.preventDefault();
	});

	/////////////////////////////////////////////////// Expand "spread the word"

	$('#spread-the-word .expand').click(function(e) {
		$('#spread-the-word').stop().animate({ right: -70 }, 'fast', function() {
			$('#spread-the-word .collapse').show();
			$('#spread-the-word .content').show();
			$('#spread-the-word .expand').css({ display: 'none' });
			$('#spread-the-word').animate({ right: 0 });
		});
		// remember state
		$.cookie('spread-the-word-hidden', null, { path: '/' });
		e.preventDefault();
	});

}); /////////////////////////////////////////////////////////////////////////////////////////// On document ready - done
