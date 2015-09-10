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
      insertType: inputControlData.insertType,
      markAsPublished: inputControlData.markAsPublished
    });
  };

  module.insertSolutionModal = function () {
    var template = win["JST"]["templates/insertSolutionModal.hbs"];
    return template();
  };

  return module;
})(ioradFreshplug.templates || {}, window);
