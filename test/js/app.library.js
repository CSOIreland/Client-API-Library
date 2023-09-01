/*******************************************************************************
Application - Library 
*******************************************************************************/

// Init
var app = app || {};

/*******************************************************************************
Application - Library - Sample
*******************************************************************************/

// Set a Sample namespace
app.sample = {};

//#region Functions/Methods

/**
 * Add a function/method
 */
app.sample.doAwesome = function () {
    alert('It does awsome!');
}

/*******************************************************************************
Application - Library app.library.apiOverride.js
*******************************************************************************/

/**
 * Pop a Confirm Modal in Bootstrap
 * @param {*} pMessage 
 * @param {*} pCallbackMethod 
 * @param {*} pCallbackParams 
 * @param {*} pIconType
 * @param {*} pShowCancelMessageType
 * @param {*} pCancelMessage
 */
api.modal.confirm = function (pMessage, pCallbackMethod, pCallbackParams, pIconType, pShowCancelMessageDialogType, pCancelMessage) {
    // Set the body of the Modal - Empty the container first
    var msgObj;
    if (typeof pMessage == "string") {
        try {
            msgObj = JSON.parse(pMessage);
        } catch (ex) {
            //cant convert to json as is a string
            msgObj = { 'title': pMessage };
        }
    } else {
        msgObj = pMessage;
    }

    $("#modal-confirm").find('[name=message-content]').empty();
    $("#modal-confirm").find('[name=message-text]').empty().html(msgObj.title);

    if (msgObj.hasOwnProperty('message')) {
        $("#modal-confirm").find('[name=message-content]').empty().html(msgObj.message);
    }

    let iconType = "";
    $("#modal-confirm").find("[name=confirm]").removeClass();
    if (pIconType == 'error') {
        iconType = 'far fa-times-circle text-danger';
        $("#modal-confirm").find("[name=confirm]").addClass("btn bg-danger text-light");
    } else if (pIconType == 'question') {
        iconType = 'fa fa-question-circle text-primary';

        $("#modal-confirm").find("[name=confirm]").addClass("btn border-primary bg-primary text-light");
    } else {
        iconType = 'fa fa-info-circle text-warning';
        $("#modal-confirm").find("[name=confirm]").addClass("btn bg-warning text-light");
    }

    $("#modal-confirm").find('[name=icon-type]').addClass(iconType);//.html(iconType);

    $("#modal-confirm").find("[name=confirm]").once("click", function () {
        // Must wait for the async transition to finsh before invoking the callback function that may be a cascade confirm
        $("#modal-confirm").modal('hide').delay(100).queue(function () {
            // https://stackoverflow.com/questions/10860171/run-function-after-delay
            pCallbackMethod(pCallbackParams);
            $(this).dequeue();
        });
    });

    $("#modal-confirm").find("[name=cancel-confirm]").once("click", function () {
        $("#modal-confirm").modal('hide');
        if (pShowCancelMessageDialogType == "success") {
            api.modal.success(pCancelMessage);
        } else if (pShowCancelMessageDialogType == "warning") {
            api.modal.warning(pCancelMessage);
        } else if (pShowCancelMessageDialogType == "information") {
            api.modal.information(pCancelMessage);
        } else if (pShowCancelMessageDialogType == "error") {
            api.modal.error(pCancelMessage);
        }
    });

    $("#modal-confirm").modal("show");
};

//#endregion