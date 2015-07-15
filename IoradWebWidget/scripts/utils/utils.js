ioradWebWidget.util.common = (function (module, win) {
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
  }

  /**
   * 
   * @returns {} true if current hostname is blah.freshdesk.com
   */
  module.IsFreshdeskKnowledgebase = function () {
    return /^.*\.freshdesk\.com$/.test(win.location.host);
  };

  /**
   * 
   * @returns {} true if current hostname is blah.desk.com
   */
  module.IsDeskKnowledgebase = function () {
    return /^.*\.desk\.com$/.test(win.location.host);
  };

  return module;
})(ioradWebWidget.util.common || {}, window);
