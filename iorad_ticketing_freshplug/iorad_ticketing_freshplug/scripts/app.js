var initializeFreshplug = function () {

  iorad = window.iorad || {};

  var $insertButtonsList = jQuery(jQuery(".redactor_insert_btns ul")[0]);
  //var ioradButtonTemplate = "<li class=\"redactor_separator\"></li><li><a href=\"#\" class=\"insert_iorad tooltip\" data-editor-id=\"cnt-reply-body\" rel=\"ticket_iorad\" data-original-title=\"Insert Iorad Screen Capture\">Iorad</a></li>";
  $insertButtonsList.append(ioradFreshplug.templates.insertIoradButtonTemplate());

  $insertIoradButton = jQuery(".insert_iorad");

  $insertIoradButton.on("click", function () {

  });

  iorad.init({ env: "live", pluginType: "freshplug_ticketing" }, function () {
    var t = 0,
      $bodyHTML = jQuery("body");

    // register events
    jQuery(".insert_iorad").click(function () {
      $bodyHTML.addClass("iorad-loading");
      iorad.createTutorial();
      t = setTimeout(function () {
        $bodyHTML.removeClass("iorad-loading");
      }, 5000);

      jQuery("#iorad-editor").off().load(function () {
        $bodyHTML.addClass("iorad-open");
        clearTimeout(t);
      })
    });

    iorad.on("editor:close", function (tutorialParams) {
      $bodyHTML.removeClass("iorad-open iorad-loading");
      clearTimeout(t);
      var iframeHTML = iorad.getEmbeddedPlayerUrl(tutorialParams.uid,
                                   tutorialParams.tutorialId, tutorialParams.tutorialTitle);
      var $editorMessageBody = jQuery(".redactor_editor div");
      $editorMessageBody.append("<p>" + iframeHTML + "</p>");
    });
  });
};

var freshPlugInit = function () {
  initTemplate();
  initializeFreshplug();
};

var CustomWidgetLoaded = function (callback) {
  var interval = 10;
  var tryLoad = function () {
    if (window.iorad && window.Handlebars) {
      callback();
    } else {
      window.setTimeout(tryLoad, interval);
    }
  };

  window.setTimeout(tryLoad, interval);
};

CustomWidgetLoaded(freshPlugInit);
