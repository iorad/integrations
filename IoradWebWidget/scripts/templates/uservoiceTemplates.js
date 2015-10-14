ioradWebWidget.templates.uservoiceTemplates = (function (module, JST) {

  module.authorizeModal = function (siteAddress, oauthToken) {
    var template = JST["templates/uservoice/oauthModal.hbs"];
    return template({ siteAddress: siteAddress, oauthToken: oauthToken });
  };

  module.mainLayout = function () {
    var template = JST['templates/uservoice/mainLayout.hbs'];
    if (ioradWebWidget.config.ENV === 'test') {
      return template({ ioradRootUrl: ioradWebWidget.config.TEST_ROOT_URL });
    }
    else if (ioradWebWidget.config.ENV === 'live') {
      return template({ ioradRootUrl: ioradWebWidget.config.LIVE_ROOT_URL });
    }

    return template();
  };

  module.widgetBodyTemplate = function (topics) {
    var template = JST["templates/uservoice/widgetBodyTemplate.hbs"];
    return template({topics : topics});
  };
  
  return module;
})(ioradWebWidget.templates.uservoiceTemplates || {}, JST || {});
