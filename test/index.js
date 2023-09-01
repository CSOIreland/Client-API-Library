$(document).ready(function () {

  // Set Document Title
  $("title").text(app.config.title);
  // Set Document Language
  $("html").attr("lang", app.config.language.iso.code);


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

  // Responsiveness
  $("#panel-toggle").once("click", function (e) {
    $("#panel").slideToggle("slow", function () {
      if ($("#panel").is(":visible")) {
        $("#panel-toggle").find("i").removeClass().addClass("fas fa-minus-circle");
      }
      else {
        $("#panel-toggle").find("i").removeClass().addClass("fas fa-plus-circle");
      }
      $('html, body').animate({ scrollTop: $('#panel-toggle').offset().top }, 1000);
    });
  });

  // Responsiveness
  $("#data-filter-toggle").once("click", function (e) {
    $("#data-filter").slideToggle("slow", function () {
      if ($("#data-filter").is(":visible")) {
        $("#data-filter-toggle").find("i").removeClass().addClass("fas fa-minus-circle");
      }
      else {
        $("#data-filter-toggle").find("i").removeClass().addClass("fas fa-plus-circle");
      }
      $('html, body').animate({ scrollTop: $('#data-filter-toggle').offset().top }, 1000);
    });
  });


  // Get Spinner
  api.content.load('#spinner', 'template/spinner.html');

  // Get Modal
  api.content.load('#modal', 'template/modal.html');

});
