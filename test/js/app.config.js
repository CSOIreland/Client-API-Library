
/*******************************************************************************
Application - Configuration
*******************************************************************************/

// Init
var app = app || {};

// Set
app.config = {};

// Load the config.json into the application
api.ajax.config("config/config.json", function (config) {
    app.config = config;
}, null, function (errorCallback) {
    alert("there has been an error loading config.json");
});