//ioradWebWidget.config.uservoice = ioradWebWidget.config.uservoice || {};

(function ($, uservoiceUtils) {
  $(document).ready(function () {
    if (!uservoiceUtils.oauthService.isAuthorized()) {
      uservoiceUtils.oauthService.authorize();
    }

    //var request_token_options = {
    //  url: 'https://iorad8.uservoice.com/oauth/request_token.json',
    //  method: 'POST',
    //  dataType: 'json',
    //  contentType: 'application/json'
    //};

    //var authorize_options = {
    //  url: 'https://iorad8.uservoice.com/oauth/authorize.json',
    //  method: 'POST',
    //  dataType: 'json',
    //  contentType: 'application/json'
    //};

    //var access_token_options = {
    //  url: 'https://iorad8.uservoice.com/oauth/access_token.json',
    //  method: 'POST',
    //  dataType: 'json',
    //  contentType: 'application/json'
    //};

    //$.ajax({
    //  url: request_token_options.url,
    //  type: request_token_options.method,
    //  headers: ioradWebWidget.util.uservoice.oauthClient.toHeader(ioradWebWidget.util.uservoice.oauthClient.authorize(request_token_options))
    //}).complete(function (data) {
    //  if (data.status === 200) {
    //    var regex = /oauth_token=(.*)&oauth_token_secret=(.*)/;
    //    var result = regex.exec(data.responseText);
    //    ioradWebWidget.config.uservoice.oauth_token = result[1];
    //    ioradWebWidget.config.uservoice.oauth_token_secret = result[2];

    //    var token = {
    //      public: ioradWebWidget.config.uservoice.oauth_token,
    //      secret: ioradWebWidget.config.uservoice.oauth_token_secret
    //    };

    //    var iframeAuthTemplate = '<div class="uvRow"><div class=uvCol-12><iframe id="authFrame" src="URL"></iframe></div></div>';

    //    $(".uvBody").append(iframeAuthTemplate.replace('URL', 'https://iorad8.uservoice.com/oauth/authorize?oauth_token='
    //                            + ioradWebWidget.config.uservoice.oauth_token
    //                            + '&oauth_callback=https://iorad8.uservoice.com'));

    //    $("#authFrame").load(function () {

    //      var authorizeReturnText = this.contentWindow.document.body.textContent;
    //      var oauthData = ioradWebWidget.util.uservoice.oauthClient.authorize(access_token_options, token);

    //      if (authorizeReturnText.contains(ioradWebWidget.config.uservoice.oauth_token)) {
    //        // user accepted the request.

    //        // now authorize.
    //        oauthData.oauth_verifier = /oauth_token=.*&oauth_verifier=(.*)/.exec(authorizeReturnText)[1];
    //        $.ajax({
    //          url: access_token_options.url,
    //          type: access_token_options.method,
    //          headers: ioradWebWidget.util.uservoice.oauthClient.toHeader(oauthData)
    //        })
    //        .complete(function (data) {
    //            if (data.status === 200) {
    //              var regex = /oauth_token=(.*)&oauth_token_secret=(.*)/;
    //              var result = regex.exec(data.responseText);
    //              ioradWebWidget.config.uservoice.oauth_token = result[1];
    //              ioradWebWidget.config.uservoice.oauth_token_secret = result[2];
    //              debugger;
    //            }
    //          });
    //      }
    //    });
        
        //$.ajax({
        //  url: authorize_options.url,
        //  type: authorize_options.method,
        //  headers: ioradWebWidget.oauth.toHeader(ioradWebWidget.oauth.authorize(authorize_options, token))
        //})
        //.complete(function (data) {
        //    debugger;
        //  });

        
    //  }
    //});
  });
})(jQuery || {}, ioradWebWidget.util.uservoice || {});
