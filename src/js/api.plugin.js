/*******************************************************************************
API - Plugin - Namespace
*******************************************************************************/
// Init
var api = api || {};

// Set
api.plugin = api.plugin || {};

/*******************************************************************************
API - Plugin - JQuery extensions
*******************************************************************************/

//Unbind all events prior to binding a new event using .on
(function ($) {
    $.fn.once = function () {
        return this.off(arguments[0]).on(arguments[0], arguments[1]);
    };
})(jQuery);

/*******************************************************************************
API - Plugin - Return To Top
*******************************************************************************/
$(document).ready(function () {
    $(window).scroll(function () {
        if ($(this).scrollTop() >= 50) {
            $("#return-to-top").fadeIn('slow');
        } else {
            $("#return-to-top").fadeOut('slow');
        }
    });

    $("#return-to-top").click(function () {
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


/*******************************************************************************
Application - Plugin - ClipboardJs on Modal Error shown
*******************************************************************************/
$(document).ready(function () {
    $(document).on('show.bs.modal', '#modal-error', function (e) {
        // Init the ClipboardJS plugin
        new ClipboardJS('#modal-error [name=clipboard]');
    });
});

/*******************************************************************************
Application - Plugin - s2ab (String To Array Buffer)
https://stackoverflow.com/questions/34993292/how-to-save-xlsx-data-to-file-as-a-blob
*******************************************************************************/
String.prototype.s2ab = String.prototype.s2ab || function () {
    var buffer = new Uint8Array(new ArrayBuffer(this.length));
    for (var i = 0; i != this.length; ++i) {
        buffer[i] = this.charCodeAt(i) & 0xFF;
    }
    return buffer;
};