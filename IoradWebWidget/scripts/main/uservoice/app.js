ioradWebWidget.uservoice = (function (module, utils, $, win) {

  var loadContent = function () {
    $.ajax(utils.uservoice.listTopics())
     .complete(function (data) {
       $(".widget-body").prepend(ioradWebWidget.templates.uservoiceTemplates.widgetBodyTemplate(data.responseJSON.topics));
      });
  };

  var initializeWidget = function () {
    if (!utils.uservoice.oauthService.isAuthorized()) {
      utils.uservoice.oauthService.authorize(loadContent);
    } else {
      loadContent();
    }

    var iorad = win.iorad || {};

    iorad.init({ env: utils.common.ioradEnv(), pluginType: utils.uservoice.ioradPluginType }, function () {
      var t = 0;

      // register events
      $("#newTutorialBtn").click(function () {
        $("body").addClass("iorad-loading");
        iorad.createTutorial();
        t = setTimeout(function () {
          $("body").removeClass("iorad-loading");
        }, 5000);
        $("#iorad-editor").off().load(function () {
          $("body").addClass("iorad-open");
          clearTimeout(t);
        });
      });

      iorad.on("editor:close", function (tutorialParams) {
        $("body").removeClass("iorad-open iorad-loading");
        clearTimeout(t);
        var iframeHTML = iorad.getEmbeddedPlayerUrl(tutorialParams.uid,
              tutorialParams.tutorialId, tutorialParams.tutorialTitle),
          $tutorialIframe = $(iframeHTML),
          topicId = $("#topicSelector").val();

      });
    });
  };

  module.runApp = function () {
    if ($(".uvModule-knowledgebase").length !== 0) {
      $(ioradWebWidget.templates.uservoiceTemplates.mainLayout()).insertAfter(".uvModule-knowledgebase .uvModuleHeader");
      utils.common.ioradLoaded(initializeWidget);
    }
  };

  return module;
})(ioradWebWidget.uservoice || {}, ioradWebWidget.util || {}, jQuery || {}, window || {});
