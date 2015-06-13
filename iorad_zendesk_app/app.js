(function () {

  var iorad = require('iorad.js');

  return {

    categoriesList: [],

    timeout: 0,

    lastCategoryId: 0,

    lastSectionId: 0,

    myDefaultLocale: '',

    events: {
      'app.activated'           : 'init',
      'pane.activated'          : 'startFetchCategories',
      'fetchCategories.done'    : 'onFetchCategories',
      'fetchSections.done'      : 'onFetchSections',
      'createArticle.done'      : 'onCreateArticle',
      'createArticle.fail'      : 'onCreateArticleFailed',
      'fetchLocales.done'       : 'onLocaleLoaded',
      'click .btn-iorad-widget' : 'submitNewTutorial',
      'change .categoryOptions' : 'updateSectionOptions',
      'iframe.editor.close'     : 'onIoradClose',
      'hidden #mySuccessModal'  : 'onModalHidden',
      'hidden #myErrorModal'    : 'onModalHidden'
    },

    requests: require('requests.js'),

    init: function () {
      this.ajax('fetchLocales');
    },

    startFetchCategories: function () {
      this.ajax('fetchCategories');
    },

    onLocaleLoaded: function (data) {
      this.myDefaultLocale = data.default_locale;
    },

    onModalHidden: function () {
      this.initializeIoradControl();
    },

    onIoradClose: function (data) {
      var iframeHTML = iorad.getEmbeddedPlayerWithViewStepsUrl(
        data.uid,
        data.tutorialId,
        data.tutorialTitle
      );

      var articleJson = JSON.stringify({
        article: {
          "title": data.tutorialTitle,
          "locale": this.myDefaultLocale,
          "body": "<p>" + iframeHTML + "</p>"
        }
      });

      // this could be replaced with a loading marque.
      this.$('.iorad-editor-wrapper').html();
      this.ajax('createArticle', this.lastSectionId, articleJson);
    },

    onFetchCategories: function (data) {
      this.categoriesList = data.categories;
      _.each(this.categoriesList, function (category) {
        category.selected = false;
      });

      this.initializeIoradControl();
    },

    onFetchSections: function (data) {
      this.switchTo('ioradWidgetControl', { categories: this.categoriesList, sections: data.sections });
    },

    onCreateArticle: function (data) {
      this.switchTo('tutorialCreatedModal', { msg: data.article.title, url: data.article.html_url });
      this.$("#mySuccessModal").modal({
        backdrop: true,
        keyboard: false
      });
    },

    onCreateArticleFailed: function (data) {
      this.switchTo('errorModal');
      this.$("#myErrorModal").modal({
        backdrop: true,
        keyboard: false
      });
    },

    submitNewTutorial: function (event) {
      event.preventDefault();
      this.lastCategoryId = parseInt(this.$(".categoryOptions").val(), 10);
      this.lastSectionId = parseInt(this.$(".sectionOptions").val(), 10);
      this.switchTo('ioradWidgetTutorialBuilder');
      var $ioradEditorIframe = this.$(".iorad-editor-wrapper iframe");
      $ioradEditorIframe.addClass("iorad-editor");
      var zendeskAppsParams = $ioradEditorIframe.attr("src").replace("?", "&");
      $ioradEditorIframe.attr("src", iorad.newTutorialEditorUrl() + zendeskAppsParams);
    },

    updateSectionOptions: function (event) {
      event.preventDefault();
      var $selection        = this.$(event.originalEvent.srcElement),
        selectedCategoryId  = parseInt($selection.val(), 10),
        selectedCategory    = _.find(this.categoriesList, function (category) {
          return category.id === selectedCategoryId;
        });
      _.each(this.categoriesList, function (category) {
        category.selected = false;
      });
      selectedCategory.selected = true;
      this.ajax('fetchSections', selectedCategoryId);
    },

    initializeIoradControl: function () {
      this.switchTo('ioradWidgetControl', { categories: this.categoriesList });
      var selectedCategoryId = parseInt(this.$('.categoryOptions').val(), 10);
      this.ajax('fetchSections', selectedCategoryId);
    }
  };

}());