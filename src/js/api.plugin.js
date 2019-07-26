/*******************************************************************************
API - Plugin - Namespace
*******************************************************************************/
// Init
var api = api || {};

// Set
api.plugin = api.plugin || {};

/*******************************************************************************
API - Plugin - Cookie consent
*******************************************************************************/

$(document).ready(function () {
	window.cookieconsent.initialise({
		"palette": {
			"popup": {
				"background": "#45c1c0",
				"text": "#ffffff"
			},
			"button": {
				"background": "#006f74",
				"text": "#ffffff"
			}
		},
		"position": "top",
		"static": true,
		"content": {
			"message": "This website uses cookies. By browsing this website, you agree to our use of cookies.",
			"dismiss": "Close",
			"link": "More info",
			"href": "http://www.cso.ie/en/privacystatement/"
		}
	})
});

/*******************************************************************************
API - Plugin - Return To Top
*******************************************************************************/

$(document).ready(function () {
	$(window).scroll(function () {
		if ($(this).scrollTop() >= 50) {
			$(C_API_SELECTOR_RETURN_TO_TOP).fadeIn('slow');
		} else {
			$(C_API_SELECTOR_RETURN_TO_TOP).fadeOut('slow');
		}
	});

	$(C_API_SELECTOR_RETURN_TO_TOP).click(function () {
		$('body,html').stop().animate({
			scrollTop: 0
		}, 500);
	});
});
