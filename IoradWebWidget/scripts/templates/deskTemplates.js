ioradWebWidget.templates.deskTemplates = {

  // main layout for iorad web widget control for desk
  mainLayout: function () {
    var template = JST['templates/desk/mainLayout.hbs'];
    if (ioradWebWidget.config.ENV === 'test') {
      return template({ ioradRootUrl: ioradWebWidget.config.TEST_ROOT_URL });
    }
    else if (ioradWebWidget.config.ENV === 'live') {
      return template({ ioradRootUrl: ioradWebWidget.config.LIVE_ROOT_URL });
    }

    return template();
  },

  // This modal shows up when there is a new desk article created successfully.
  deskModal: function (articleUrl, title) {
    var template = JST['templates/desk/modalTemplate.hbs'];
    return template({articleUrl: articleUrl, articleTitle: title});
  },

  // This template displays all available topics as options.
  topicsTemplate: function (topics) {
    var template = JST['templates/desk/topicsList.hbs'];
    return template({ topics: topics });
  }
};
