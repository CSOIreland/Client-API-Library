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

/*******************************************************************************
Application - Plugin - Cookie consent
*******************************************************************************/

$(document).ready(function () {
    // Set the options from the config and the label
    window.cookieconsent.initialise($.extend({}, app.config.plugin.cookieConsent));
});