ioradWebWidget.desk = (function (module) {

  /**
   * 
   * @param {} $ jQuery object
   * @param {} win Window object
   */
  module.runApp = function ($, win) {

    //TODO: put desk mainLayout in the container.
    var $container = $('#support-main');
    $container.prepend(ioradWebWidget.templates.deskTemplates.mainLayout());
    var initializeWidget = function () {

    };

    ioradWebWidget.util.common.ioradLoaded(initializeWidget);
  };
  
  return module;
})(ioradWebWidget.desk || {});
