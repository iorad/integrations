ioradWebWidget.uservoice = (function (module, utils) {

  var loadContent = function () {
    debugger;
  };

  var initializeWidget = function () {
    if (!utils.uservoice.oauthService.isAuthorized()) {
      utils.uservoice.oauthService.authorize(loadContent);
    } else {
      loadContent();
    }
  };

  module.runApp = function ($, win) {
    if ($(".uvModule-knowledgebase").length !== 0) {
      $(ioradWebWidget.templates.uservoiceTemplates.mainLayout()).insertAfter(".uvModule-knowledgebase .uvModuleHeader");
      utils.common.ioradLoaded(initializeWidget);
    }
  };

  return module;
})(ioradWebWidget.uservoice || {}, ioradWebWidget.util || {});
