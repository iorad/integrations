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

ioradWebWidget.util.uservoice = (function (module, config) {
  /**
   * this field is used to populate the options field when initializing iorad.js.
   */
  module.ioradPluginType = 'uservoiceweb_solutions';

  var ARTICLE_API_URL = '/api/v1/articles.json',
    List_TOPICS_API_URL = '/api/v1/topics.json',
    initAjaxOption = function () {
      return { dataType: 'json', contentType: 'application/json' };
    };

  module.listTopics = function () {
    var ajaxOptions = initAjaxOption();
    ajaxOptions.method = 'GET';
    ajaxOptions.url = List_TOPICS_API_URL;
    //ajaxOptions.data = { client: 'PZaLFuj077kDkBQuAQQ' };
    ajaxOptions.data = { client: config.Key };
    return ajaxOptions;
  };

  return module;
})(ioradWebWidget.util.uservoice || {}, ioradWebWidget.config.uservoice || {});

ioradWebWidget.util.uservoice.oauthService = (function (module, oauthClient, templates, $) {

  var tokenResponseTextRegex    = /oauth_token=(.*)&oauth_token_secret=(.*)/,
    authorizeResponseTextRegex  = /oauth_token=.*&oauth_verifier=(.*)/;

  var requestTokenUrl = 'https://iorad8.uservoice.com/oauth/request_token.json',
    accessTokenUrl    = 'https://iorad8.uservoice.com/oauth/access_token.json';
  
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

  var onAuthFrameLoaded = function () {
    var authorizeReturnText = this.contentWindow.document.body.textContent,
      options = ajaxOptions();
    options.url = accessTokenUrl;

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
        }
      });

      $modal = $("#oauthModal");
      $("#oauthModal").on('hidden.bs.modal', function (e) {
        $modal.remove();
      });

      $modal.modal('hide');
    }
  };

  var promptUserForAuthorize = function (data) {
    if (data.status === 200) {
      extractToken(data.responseText);

      $("body").append(templates.authorizeModal(window.location.protocol + "//" + window.location.hostname, oauthToken));
      $("#oauthModal").modal('show');

      $("#authFrame").load(onAuthFrameLoaded);
    }
  };
  
  module.isAuthorized = function () {
    return oauthToken && oauthTokenSecret && oauthVerifier;
  };

  /**
   * Execute a 3-legged authentication. oauth 1.0a
   * @param {} callback callback function to execute once authorization process is done.
   * @returns {} 
   */
  module.authorize = function (callback) {
    var options = ajaxOptions();
    options.url = requestTokenUrl;
    $.ajax({
        url: options.url,
        type: options.method,
        headers: oauthClient.toHeader(oauthClient.authorize(options))
      })
      .complete(promptUserForAuthorize);
  };
  
  return module;
})(ioradWebWidget.util.uservoice.oauthService || {},
   ioradWebWidget.util.uservoice.oauthClient || {},
   ioradWebWidget.templates.uservoiceTemplates || {},
   jQuery);
