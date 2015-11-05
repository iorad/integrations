ioradWebWidget.util.uservoice = {};

ioradWebWidget.util.uservoice.oauthClient = (function (module, config) {

  module = OAuth({
    consumer: {
      public: config.consumerPublic,
      secret: config.consumerSecret
    },
    signature_method: 'HMAC-SHA1'
  });
  
  return module;
})(ioradWebWidget.util.uservoice.oauthClient || {},
   ioradWebWidget.config.uservoice || {});


ioradWebWidget.util.uservoice.oauthService = (function (module, oauthClient, templates, $) {

  var tokenResponseTextRegex    = /oauth_token=(.*)&oauth_token_secret=(.*)/,
    authorizeResponseTextRegex  = /oauth_token=.*&oauth_verifier=(.*)/;

  var requestTokenUrl = '/oauth/request_token.json',
    accessTokenUrl = '/oauth/access_token.json';
  
  var oauthToken, oauthTokenSecret, oauthVerifier;

  var ajaxOptions = function () {
    return {
      method: 'POST'
    };
  };

  var extractToken = function (responseText) {
    var tokenArray = tokenResponseTextRegex.exec(responseText);
    oauthToken = tokenArray[1];
    oauthTokenSecret = tokenArray[2];
  };

  var onAuthFrameLoaded = function (e, callback) {
    var authorizeReturnText = e.originalEvent.target.contentWindow.document.body.textContent,
      options = ajaxOptions();
    options.url = window.location.origin + accessTokenUrl;

    // user accepted the request.
    if (authorizeReturnText.contains(oauthToken)) {
      var oauthData = oauthClient.authorize(options, { public: oauthToken, secret: oauthTokenSecret });
      oauthData.oauth_verifier = oauthVerifier = authorizeResponseTextRegex.exec(authorizeReturnText)[1];

      // now complete authorize.
      $.ajax({
        url: options.url,
          type: options.method,
          headers: oauthClient.toHeader(oauthData)
        })
      .complete(function (data) {
        if (data.status === 200) {
          extractToken(data.responseText);
          if (callback) {
            callback();
          }
        }
      });

      $modal = $("#oauthModal");
      $("#oauthModal").on('hidden.bs.modal', function (e) {
        $modal.remove();
      });

      $modal.modal('hide');
    }
  };

  var promptUserForAuthorize = function (data, callback) {
    if (data.status === 200) {
      extractToken(data.responseText);

      $("body").append(templates.authorizeModal(window.location.origin, oauthToken));
      $("#oauthModal").modal('show');

      $("#authFrame").load(function (e) {
        onAuthFrameLoaded(e, callback);
      });
    }
  };
  
  module.isAuthorized = function () {
    return oauthToken && oauthTokenSecret && oauthVerifier;
  };

  module.getOauthHeader = function (ajaxOptions) {
    var oauthData = oauthClient.authorize(ajaxOptions, { public: oauthToken, secret: oauthTokenSecret });
    //oauthData.oauth_verifier = oauthVerifier;
    return oauthClient.toHeader(oauthData);
  };

  /**
   * Execute a 3-legged authentication. oauth 1.0a
   * @param {} callback callback function to execute once authorization process is done.
   * @returns {} 
   */
  module.authorize = function (callback) {
    var options = ajaxOptions();
    options.url = window.location.origin + requestTokenUrl;
    $.ajax({
        url: options.url,
        type: options.method,
        headers: oauthClient.toHeader(oauthClient.authorize(options))
      })
      .complete(function (data) { promptUserForAuthorize(data, callback); });
  };
  
  return module;
})(ioradWebWidget.util.uservoice.oauthService || {},
   ioradWebWidget.util.uservoice.oauthClient || {},
   ioradWebWidget.templates.uservoiceTemplates || {},
   jQuery);

ioradWebWidget.util.uservoice = (function (module, config, oauthService) {
  /**
   * this field is used to populate the options field when initializing iorad.js.
   */
  module.ioradPluginType = 'uservoiceweb_solutions';

  var ARTICLE_API_URL = '/api/v1/articles.json',
    List_TOPICS_API_URL = '/api/v1/topics.json',
    initAjaxOption = function () {
      return { dataType: 'json', contentType: 'application/x-www-form-urlencoded; charset=UTF-8' };
    };

  module.listTopics = function () {
    var ajaxOptions = initAjaxOption();
    ajaxOptions.method = 'GET';
    ajaxOptions.url = window.location.origin + List_TOPICS_API_URL;
    ajaxOptions.headers = oauthService.getOauthHeader(ajaxOptions);
    return ajaxOptions;
  };

  module.createArticle = function (article) {
    var ajaxOptions = initAjaxOption();
    ajaxOptions.method = 'POST';
    ajaxOptions.url = window.location.origin + ARTICLE_API_URL;
    ajaxOptions.data = article;
    ajaxOptions.headers = oauthService.getOauthHeader(ajaxOptions);
    return ajaxOptions;
  };

  module.listArticles = function () {
    var ajaxOptions = initAjaxOption();
    ajaxOptions.method = 'GET';
    ajaxOptions.url = window.location.origin + ARTICLE_API_URL;
    ajaxOptions.headers = oauthService.getOauthHeader(ajaxOptions);
    return ajaxOptions;
  };

  // generate article object.
  module.createArticleObject = function (title, body, isPublished, topicId) {
    return {
      'article[question]': title,
      'article[answer_html]': body,
      'article[published]': isPublished,
      'article[topic_id]': topicId
    };
  };

  return module;
})(ioradWebWidget.util.uservoice || {}, ioradWebWidget.config.uservoice || {}, ioradWebWidget.util.uservoice.oauthService || {});
