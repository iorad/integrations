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
  };

  module.runApp = function () {
    if ($(".uvModule-knowledgebase").length !== 0) {
      $(ioradWebWidget.templates.uservoiceTemplates.mainLayout()).insertAfter(".uvModule-knowledgebase .uvModuleHeader");
      utils.common.ioradLoaded(initializeWidget);
    }
  };

  return module;
})(ioradWebWidget.uservoice || {}, ioradWebWidget.util || {}, jQuery || {}, window || {});
