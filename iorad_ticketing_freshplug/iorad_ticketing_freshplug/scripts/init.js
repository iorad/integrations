CustomWidget.include_js("//iorad.com/server/assets/js/iorad.js");
CustomWidget.include_js("//cdnjs.cloudflare.com/ajax/libs/handlebars.js/3.0.3/handlebars.min.js");

var ioradFreshplug = (function (module, undefined) {
  module = {
    util: {},
    templates: {},
    requests: {},
    addToKnowledgebase: false,
    markAsPublished: true,
    categories: [],
    selectedCategoryId: undefined,
    foldersDictionary: {}
  };

  return module;
})(ioradFreshplug || {});
