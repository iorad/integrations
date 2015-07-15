ioradWebWidget.desk = (function (module) {

  /**
   * 
   * @param {} $ jQuery object
   * @param {} win Window object
   */
  module.runApp = function ($, win) {

    //TODO: put desk mainLayout in the container.
    var $container = $('.wrapper');
    $container.html(ioradWebWidget.templates.deskTemplates.mainLayout() + $container.html());

    var initializeWidget = function () {

    };

    ioradWebWidget.util.common.ioradLoaded(initializeWidget);
  };
  
  return module;
})(ioradWebWidget.desk || {});