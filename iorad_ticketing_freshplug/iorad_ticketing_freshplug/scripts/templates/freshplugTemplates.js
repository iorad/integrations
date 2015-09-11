ioradFreshplug.templates = (function (module, win, undefined) {
  module.insertIoradButtonTemplate = function () {
    var template = win["JST"]["templates/insertIoradButtonTemplate.hbs"];
    return template();
  };

  module.inputControlTemplate = function (inputControlData) {
    var template = win["JST"]["templates/inputControlTemplate.hbs"];
    return template({
      categories: inputControlData.categories,
      folders: inputControlData.folders,
      addToKnowledgebase: inputControlData.addToKnowledgebase,
      markAsPublished: inputControlData.markAsPublished
    });
  };

  module.insertSolutionModal = function () {
    var template = win["JST"]["templates/insertSolutionModal.hbs"];
    return template();
  };

  module.getHyperLink = function (href, content) {
    var template = win["JST"]["templates/hyperLinkTemplate.hbs"];
    return template({ href: href, content: content });
  };

  return module;
})(ioradFreshplug.templates || {}, window);
