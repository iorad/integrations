ioradWebWidget.templates.uservoiceTemplates = (function (module, JST) {

  module.authorizeModal = function (siteAddress, oauthToken) {
    var template = JST["templates/uservoice/oauthModal.hbs"];
    return template({ siteAddress: siteAddress, oauthToken: oauthToken });
  };
  
  return module;
})(ioradWebWidget.templates.uservoiceTemplates || {}, JST || {});
