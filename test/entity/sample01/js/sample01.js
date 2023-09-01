/*******************************************************************************
Custom JS application specific
*******************************************************************************/
$(document).ready(function () {
    // Start the Drag n Drop
    api.plugin.dragndrop.initiate(document, window);

    $("#upload-form").find("#upload-btn-cancel").once("click", function () {
        app.sample.file.reset();
    });


    $("#upload-form").find("#upload-btn-upload").once("click", function () {
        api.modal.success("TEST");
    });
});


