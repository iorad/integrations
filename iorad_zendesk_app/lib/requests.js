module.exports = {
  fetchCategories: function () {
    return {
      dataType: 'json',
      contentType: 'application/json',
      url: '/api/v2/help_center/categories.json',
      type: 'GET'
    };
  },
  fetchSections: function (categoryId) {
    var GET_SECTIONS_END_POINT = '/api/v2/help_center/categories/{id}/sections.json';

    return {
      dataType: 'json',
      contentType: 'application/json',
      url: GET_SECTIONS_END_POINT.replace('{id}', categoryId.toString()),
      type: 'GET'
    };
  },
  /**
   * article should be in valid json format, following zendesk standard.
   * @param  {int} sectionId section id
   * @param  {object} article   article json object
   * @return {object}           a json object representing ajax options.
   */
  createArticle: function (sectionId, article) {
    var POST_ARTICLE_END_POINT = '/api/v2/help_center/sections/{id}/articles.json';

    return {
      dataType: 'json',
      contentType: 'application/json',
      url: POST_ARTICLE_END_POINT.replace('{id}', sectionId.toString()),
      type: 'POST',
      data: article
    };
  },
  /**
   * fetch all enabled "locales" as well as "default_locale"
   * @return {object} a json object representing ajax options.
   */
  fetchLocales: function () {
    return {
      dataType: 'json',
      contentType: 'application/json',
      url: '/api/v2/help_center/locales.json',
      type: 'GET'
    };
  }
};
