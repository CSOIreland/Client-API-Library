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

/*******************************************************************************
Application - Plugin - sprintf
*******************************************************************************/
String.prototype.sprintf = String.prototype.sprintf || function (params) {
	params = params || [];

	var sprintfRegex = /\{(\d+)\}/g;
	var sprintf = function (match, number) {
		return number in params ? params[number] : match;
	};

	if (Array.isArray(params) && params.length)
		return this.replace(sprintfRegex, sprintf);
	else
		return this;
};

/*******************************************************************************
Application - Plugin - ucwords
*******************************************************************************/
String.prototype.ucwords = String.prototype.ucwords || function () {
	str = this.toLowerCase();
	return str.replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g, function (s) { return s.toUpperCase(); });
};
