ioradWebWidget.templates.freshdeskTemplates = {
  // main layout for iorad widget control. At the moment, this widget control works best with the new freshtheme.
  mainLayout: function () {
    var template = JST['templates/freshdesk/mainLayout.hbs'];
    if (ioradWebWidget.config.ENV === 'test') {
      return template({ ioradRootUrl: ioradWebWidget.config.TEST_ROOT_URL });
    }
    else if (ioradWebWidget.config.ENV === 'live') {
      return template({ ioradRootUrl: ioradWebWidget.config.LIVE_ROOT_URL });
    }

    return template();
  },

  // This modal shows up when there is a new fresh desk article created successfully. Pass in the url as parameter.
  freshDeskModal: function (article, title) {
    var template = JST['templates/freshdesk/modalTemplate.hbs'];
    return template({ article: article, articleTitle: title });
  },

  // This template displays all available categories as options.
  categoryOptionTemplate: function (categories) {
    var template = JST['templates/freshdesk/freshdeskCategoryList.hbs'];
    return template({ categories: categories });
  },

  // This template displays all folders as select/options.
  folderListTemplate: function (categories) {
    var template = JST['templates/freshdesk/freshdeskFolderList.hbs'];
    return template({ categories: categories });
  },

  // This template displays an solution article to be created.
  articleTemplate: function (tutorialIframe, steps) {
    var template = JST['templates/freshdesk/freshdeskArticleTemplate.hbs'];
    return template({iframeSrc: tutorialIframe, steps: steps});
  }
};
