(function () {

  var iorad = require('iorad.js');

  return {

    categoriesList: [],

    lastSectionsList: [],

    timeout: 0,

    lastCategoryId: 0,

    lastSectionId: 0,

    myDefaultLocale: '',

    SOLUTION_APP_LOCATION: 'nav_bar',

    TICKETING_APP_LOCATION_PATTERN: /ticket_sidebar$/,

    currentPluginType: '',

    addToKnowledgebase: false,

    pluginTypes: {
      SOLUTION: 'zendeskapp_solutions', // this is a nav bar app that creates tutorials.
      TICKETING: 'zendeskapp_ticketing' // this is a ticket sidebar app that creates tutorials for existing and new tickets.
    },

    TICKET_COMMENT_MARKDOWN_FORMAT: '[%@](https:%@)',

    events: {
      'app.activated'                   : 'init',
      'pane.activated'                  : 'runSolutionApp',
      'fetchCategories.done'            : 'onFetchCategories',
      'fetchSections.done'              : 'onFetchSections',
      'createArticle.done'              : 'onCreateArticle',
      'createArticle.fail'              : 'onCreateArticleFailed',
      'fetchLocales.done'               : 'onLocaleLoaded',
      'click .btn-iorad-widget'         : 'submitNewTutorial',
      'change .categoryOptions'         : 'updateSectionOptions',
      'iframe.editor.close'             : 'onIoradClose',
      'hidden #mySuccessModal'          : 'onModalHidden',
      'hidden #myErrorModal'            : 'onModalHidden',
      'click #addToKnowledgebaseToggle' : 'onAddToKnowledgebaseToggleClicked'
    },

    requests: require('requests.js'),

    init: function () {
      this.ajax('fetchLocales');
      this.runTicketingApp();
    },

    // conditionally run app based on app current location
    runSolutionApp: function () {
      if (this.currentLocation() === this.SOLUTION_APP_LOCATION) {

        // load post to solutions app.
        this.currentPluginType = this.pluginTypes.SOLUTION;
        this.startFetchCategories();
      }
    },

    runTicketingApp: function () {
      if (this.TICKETING_APP_LOCATION_PATTERN.test(this.currentLocation())) {

        // load ticketing app.
        this.currentPluginType = this.pluginTypes.TICKETING;
        this.switchTo('ticketingTemplate');
      }
    },

    startFetchCategories: function () {
      this.ajax('fetchCategories');
    },

    onLocaleLoaded: function (data) {
      this.myDefaultLocale = data.default_locale;
    },

    onModalHidden: function () {
      this.initializeSolutionAppControl();
    },

    onIoradClose: function (data) {
      if (this.currentPluginType === this.pluginTypes.SOLUTION || this.addToKnowledgebase) {
        this.createArticle(data);
      } else if (this.currentPluginType === this.pluginTypes.TICKETING) {
        this.addIoradPlayerUrlToNewTicketComment(data);
      }
    },

    onFetchCategories: function (data) {
      this.categoriesList = data.categories;
      _.each(this.categoriesList, function (category) {
        category.selected = false;
      });

      this.categoriesList[0].selected = true;

      if (this.currentPluginType === this.pluginTypes.SOLUTION) {
        this.initializeSolutionAppControl();
      } else {
        this.initializeTicketingAppControl();
      }
    },

    onFetchSections: function (data) {
      this.lastSectionsList = data.sections;
      if (this.currentPluginType === this.pluginTypes.SOLUTION) {
        this.switchTo('ioradWidgetControl', { categories: this.categoriesList, sections: this.lastSectionsList });
      } else {
        this.switchTo('ticketingTemplate', { categories: this.categoriesList, sections: this.lastSectionsList, addToKnowledgebase: this.addToKnowledgebase });
      }
    },

    onCreateArticle: function (data) {
      if (this.addToKnowledgebase && this.currentPluginType === this.pluginTypes.TICKETING) {
        this.addSolutionUrlToNewTicketComment({ title: data.article.title, url: data.article.html_url });
      } else {
        this.switchTo('tutorialCreatedModal', { msg: data.article.title, url: data.article.html_url });
        this.$("#mySuccessModal").modal({
          backdrop: true,
          keyboard: false
        });
      }
    },

    onCreateArticleFailed: function (data) {
      this.switchTo('errorModal');
      this.$("#myErrorModal").modal({
        backdrop: true,
        keyboard: false
      });
    },

    onAddToKnowledgebaseToggleClicked: function (event) {
      this.addToKnowledgebase = event.target.checked;
      if (this.addToKnowledgebase) {
        this.$(".loading").removeClass("hide");
        this.startFetchCategories();
      } else {
        this.switchTo('ticketingTemplate');
      }
    },

    submitNewTutorial: function (event) {
      event.preventDefault();
      this.lastCategoryId = parseInt(this.$(".categoryOptions").val(), 10);
      this.lastSectionId = parseInt(this.$(".sectionOptions").val(), 10);
      this.switchTo('ioradWidgetTutorialBuilder');
      var $ioradEditorIframe = this.$(".iorad-editor-wrapper iframe");
      $ioradEditorIframe.addClass("iorad-editor");
      var zendeskAppsParams = $ioradEditorIframe.attr("src").replace("?", "&");
      $ioradEditorIframe.attr("src", iorad.newTutorialEditorUrl(event.view.location.href, this.currentPluginType) + zendeskAppsParams);
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

    initializeSolutionAppControl: function () {
      this.switchTo('ioradWidgetControl', { categories: this.categoriesList });
      var selectedCategoryId = parseInt(this.$('.categoryOptions').val(), 10);
      this.ajax('fetchSections', selectedCategoryId);
    },

    initializeTicketingAppControl: function () {
      this.ajax('fetchSections', this.categoriesList[0].id);
    },

    createArticle: function (data) {
      var iframeHTML = iorad.getEmbeddedPlayerUrl(
        data.uid,
        data.tutorialId,
        data.tutorialTitle
      ),
        articleBody = helpers.fmt("<p>%@</p>", iframeHTML);

      _.each(data.steps, function (step) {
        articleBody += helpers.fmt("<p style='display: none;'>%@</p>", helpers.safeString(step.description).string);
      });

      var articleJson = JSON.stringify({
        article: {
          "title": data.tutorialTitle,
          "locale": this.myDefaultLocale,
          "body": articleBody
        }
      });

      // this could be replaced with a loading marque.
      this.$('.iorad-editor-wrapper').html();
      this.ajax('createArticle', this.lastSectionId, articleJson);
    },

    addIoradPlayerUrlToNewTicketComment: function (data) {
      var url = iorad.getPlayerUrl(data.uid, data.tutorialId, data.tutorialTitle),
        comment = helpers.fmt(this.TICKET_COMMENT_MARKDOWN_FORMAT, data.tutorialTitle, url);

      this.comment().text(this.comment().text() + comment);
      this.switchTo('ticketingTemplate');
    },

    addSolutionUrlToNewTicketComment: function (article) {
      var comment = helpers.fmt(this.TICKET_COMMENT_MARKDOWN_FORMAT, article.title, article.url);
      this.comment().text(this.comment().text() + comment);
      this.switchTo('ticketingTemplate', { categories: this.categoriesList, sections: this.lastSectionsList, addToKnowledgebase: this.addToKnowledgebase });
    }
  };
}());