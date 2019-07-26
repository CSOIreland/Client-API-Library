// Set Document Title
document.title = app.config.title;

$(document).ready(function () {
    if (!api.uri.getNoHeader())
        //  Get Header
        api.content.load('#header', 'template/header.html');

    if (!api.uri.getNoNavbar())
        // Get Navigation
        api.content.load('#navigation', 'template/navigation.html');

    if (!api.uri.getBody())
        // Get Default Body
        api.content.load('#body', 'entity/sample01/');
    else
        // Get Custom Body
        api.content.load('#body', api.uri.getBody());

    if (!api.uri.getNoFooter())
        // Get Footer
        api.content.load('#footer', 'template/footer.html');

    // Get Spinner
    api.content.load('#spinner', 'template/spinner.html');

    // Get Modal
    api.content.load('#modal', 'template/modal.html');

});
