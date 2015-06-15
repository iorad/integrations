/**
 * try to find me.
 */
var ioradWebWidget = (function (module, undefined) {
  module = {
    freshdesk: {},
    config: {},
    util: {},
    templates: {}
  };

  return module;
})(ioradWebWidget || {});

ioradWebWidget.templates = {
  // main layout for iorad widget control. At the moment, this widget control works best with the new freshtheme.
  mainLayout: function () {
    var template = JST['templates/mainLayout.hbs'];
    return template();
  },

  // This modal shows up when there is a new fresh desk article created successfully. Pass in the url as parameter.
  freshDeskModal: function (url, title) {
    var template = JST['templates/modalTemplate.hbs'];
    return template({url: url, articleTitle: title});
  }
};
