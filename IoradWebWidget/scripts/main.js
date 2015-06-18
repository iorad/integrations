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
  freshDeskModal: function (article, title) {
    var template = JST['templates/modalTemplate.hbs'];
    return template({article: article, articleTitle: title});
  },

  // This template displays all available categories as options.
  categoryOptionTemplate: function (categories) {
    var template = JST['templates/freshdeskCategoryList.hbs'];
    return template({ categories: categories });
  },

  // This template displays all folders as select/options.
  folderListTemplate: function (categories) {
    var template = JST['templates/freshdeskFolderList.hbs'];
    return template({ categories: categories });
  }
};
