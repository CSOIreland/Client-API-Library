/*******************************************************************************
Custom JS application specific
*******************************************************************************/
app.sample = app.sample || {};
app.sample.file = {};


api.cookie.session.start(100, "test", "PxStat.Security.Login_API.Logout");


/**
*Read content of file
* @param {*} file
* @param {*} inputObject
*/
api.plugin.dragndrop.readFiles = function (files, inputObject) {
    app.sample.OnFileDrop(inputObject, files);
};


/**
* OnFileDrop
*
* @param {*} inputObject
* @param {*} files
* @param {*} fileToken
* @returns
*/
app.sample.OnFileDrop = function (inputObject, files) {

    app.sample.file.reset();


    // Read single file only
    var file = files[0];
    if (!file) {
        return;
    }
    // Info on screen 
    inputObject.parent().find("#upload-file-tip").hide();
    inputObject.parent().find("#upload-file-name").html(file.name + " (" + app.sample.formatNumber(Math.ceil(file.size / 1024)) + " KB)").show();
};

app.sample.formatNumber = function (number, precision) {
    precision = precision !== undefined ? precision : undefined;
    var decimalSeparator = app.sample.decimalSeparator();
    var thousandSeparator = app.sample.thousandSeparator();

    if ("number" !== typeof number && "string" !== typeof number)
        return number;

    if (isNaN(number)) { //output any non number as html
        return "string" === typeof number ? number.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;") : number;
    } else {
        floatNumber = parseFloat(number);
    }

    if (precision !== undefined) {
        floatNumber = floatNumber.toFixed(precision);
    } else {
        floatNumber = floatNumber.toString();
    }

    var parts = floatNumber.split(".");
    var wholeNumber = parts[0].toString();
    var decimalNumber = parts[1] !== undefined ? parts[1].toString() : undefined;
    return (thousandSeparator ? wholeNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator) : wholeNumber) + (decimalNumber !== undefined ? decimalSeparator + decimalNumber : "");
};

app.sample.decimalSeparator = function () {
    var n = 1.1;
    return n.toLocaleString().substring(1, 2);
}

app.sample.thousandSeparator = function () {
    var n = 1000;
    return n.toLocaleString().substring(1, 2);
}

app.sample.file.reset = function () {
    // Clear file details
    $('#upload-form').find("#upload-file-name").empty().hide();
    $('#upload-form').find("#upload-file-tip").show();
};