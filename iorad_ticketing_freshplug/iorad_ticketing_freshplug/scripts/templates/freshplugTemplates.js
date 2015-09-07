ioradFreshplug.templates = (function (module, win, undefined) {
  module.insertIoradButtonTemplate = function () {
    var template = win["JST"]["templates/insertIoradButtonTemplate.hbs"];
    return template();
  };

  return module;
})(ioradFreshplug.templates || {}, window);

