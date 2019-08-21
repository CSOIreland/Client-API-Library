/*******************************************************************************
API - Plugin - Namespace
*******************************************************************************/
// Init
var api = api || {};

// Set
api.plugin = api.plugin || {};

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
