ioradWebWidget.util.desk = (function (module) {

  var initAjaxOption = function () {
    return { dataType: 'json', contentType: 'application/json' }
  };

  module.listTopics = function () {
    var ajaxOptions = initAjaxOption();
    ajaxOptions.type = 'GET';
    ajaxOptions.url = '/api/v2/topics?per_page=100'; // display maximum 100 topics, hopefully we could load all customers topics in one page...
    return ajaxOptions;
  }

  /**
   * generate ajax request options required for creating an article on desk.com.
   * @param string article a article json string.
   * @returns {} an ajax option object
   */
  module.createArticle = function (article) {
    var ajaxOptions = initAjaxOption();
    ajaxOptions.type = 'POST';
    ajaxOptions.URL = '/api/v2/articles';
    ajaxOptions.data = article;
    return ajaxOptions;
  };

  /**
   * generate an article json data used for the createArticle ajax request
   * @param {} topicLink expect topic object {href: "href", class: "topic"}
   * @param string articleBody article body string
   * @param string articleTitle article title string
   * @returns string json string. 
   */
  module.prepArticleJson = function (topicLink, articleBody, articleTitle)
  {
    var article = {};
    article.subject = articleTitle;
    article.body = articleBody;
    article._links = {
      topic: topicLink
    }

    return JSON.stringify(article);
  }

  return module;
})(ioradWebWidget.util.desk || {});
