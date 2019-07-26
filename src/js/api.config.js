/*******************************************************************************
API - Configuration 
*******************************************************************************/

/**
 * Preset JQuery Ajax calls to be ASynch by default
 * @param {*} options
 * @param {*} originalOptions
 * @param {*} jqXHR
 */
$.ajaxPrefilter(function (options, originalOptions, jqXHR) {
    options.async = originalOptions.async === undefined ? true : originalOptions.async;
});