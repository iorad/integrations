(function() {

  var iorad = require('iorad.js');

  return {
    
    categoriesList: [],

    events: {
      'app.activated': 'init',
      'fetchCategories.done': 'onFetchCategories',
      'fetchSections.done': 'onFetchSections',
      'createArticle.done': 'onCreateArticle',
      'click .btn-iorad-widget': 'submitNewTutorial',
      'change .categoryOptions': 'updateSectionOptions'
    },

    requests: require('requests.js'),

    init: function() {
      this.ajax('fetchCategories');
    },

    onFetchCategories: function(data) {
      this.categoriesList = data.categories;
      this.switchTo('ioradWidget', { categories: this.categoriesList });
      var selectedCategoryId = this.$('.categoryOptions').val();
      this.ajax('fetchSections', selectedCategoryId);
    },

    onFetchSections: function(data) {
      this.switchTo('ioradWidget', { categories: this.categoriesList, sections: data.sections });
    },

    onCreateArticle: function(data) {
      debugger;
    },

    submitNewTutorial: function(event) {
      debugger;
    },

    updateSectionOptions: function(event) {
      event.preventDefault();
      var $selection = this.$(event.originalEvent.srcElement);
      this.ajax('fetchSections', $selection.val());
    },

    requestBookmarks: function() {
      console.log('CommonJS Sample app loaded');
      this.ajax('fetchBookmarks');
    }
  };

}());