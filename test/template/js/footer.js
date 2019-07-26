/*******************************************************************************
Footer
*******************************************************************************/
$(document).ready(function () {
    //add footer links
    var numLinks = app.config.url.footer.length;
    $.each(app.config.url.footer, function (index, value) {
        var link = $("<a>", {
            "href": value.href,
            "text": value.text,
            "class": "text-muted",
            "target": "_blank"
        }).get(0).outerHTML

        if (index != (numLinks - 1)) {
            $("#footer").find("[name=links]").append(
                link + " | "
            );
        }
        else {//last link
            $("#footer").find("[name=links]").append(
                link
            );
        }
    });
});