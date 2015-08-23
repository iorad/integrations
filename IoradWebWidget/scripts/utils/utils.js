ioradWebWidget.util.common = (function (module, win) {

  /**
   * this field is used to populate the options field when initializing iorad.js.
   */
  module.ioradPluginType = 'freshdeskweb_solutions';

  /**
   * wait for iorad.js to load. once loaded, execute callback()
   * @param {} callback the callback function.
   * @returns {} 
   */
  module.ioradLoaded = function (callback) {
    var interval = 10;
    var tryLoad = function () {
      if (win.iorad) {
        callback();
      } else {
        win.setTimeout(tryLoad, interval);
      }
    };

    win.setTimeout(tryLoad, interval);
  };

  /**
   * 
   * @returns {} true if current hostname is blah.freshdesk.com
   */
  module.isFreshdeskKnowledgebase = function () {
    return /^.*\.freshdesk\.com$/.test(win.location.host);
  };

  /**
   * 
   * @returns {} true if current hostname is blah.desk.com
   */
  module.isDeskKnowledgebase = function () {
    return /^.*\.desk\.com$/.test(win.location.host);
  };

  /**
   * get the environment setting for initiating iorad.js
   * @returns {} 
   */
  module.ioradEnv = function () {
    if (ioradWebWidget.config.ENV === 'test') {
      return 'prod';
    } else if (ioradWebWidget.config.ENV === 'live') {
      return 'live';
    }

    return 'prod';
  };

  return module;
})(ioradWebWidget.util.common || {}, window);
