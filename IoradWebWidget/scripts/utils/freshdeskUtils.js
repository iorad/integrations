ioradWebWidget.freshdesk = (function (module) {
  
  var SOLUTION_CATEGORIES_API_URL = '/solution/categories.json',
    ARTICLE_API_URL = '/solution/categories/{category_id}/folders/{folder_id}/articles.json',
    initAjaxOption = function () {
       return { dataType: 'json', contentType: 'application/json'}
    };
  module.listCategories = function () {
    var ajaxOptions = initAjaxOption();
    ajaxOptions.type = 'GET';
    ajaxOptions.url = SOLUTION_CATEGORIES_API_URL;
    return ajaxOptions;
  };

  module.createArticle = function (categoryId, folderId, article) {
    var ajaxOptions = initAjaxOption();
    ajaxOptions.type = 'POST';
    ajaxOptions.url = ARTICLE_API_URL.replace('{category_id}', categoryId.toString()).replace('{folder_id}', folderId.toString());
    ajaxOptions.data = article;
    return ajaxOptions;
  };

  return module;

})(ioradWebWidget.freshdesk || {});
