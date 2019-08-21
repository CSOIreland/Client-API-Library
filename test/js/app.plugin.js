/*******************************************************************************
Application - Plugin 
*******************************************************************************/

/*******************************************************************************
Application - Plugin - Cookie consent
*******************************************************************************/

$(document).ready(function () {
    // Set the options from the config and the label
    window.cookieconsent.initialise($.extend({}, app.config.plugin.cookieConsent));
});