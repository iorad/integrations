// Iorad Widget starts here.
function ioradWidget() {
  var $ioradWidget = $(".iorad-widget"),
      canEditHelpCenter = HelpCenter.user.role == "agent" || HelpCenter.user.role == "manager";

  if ($ioradWidget.length == 1 && canEditHelpCenter) {
    var iorad = window.iorad || {};
    $ioradWidget.show();

    iorad.init({ env: 'prod' }, function () {
      // iorad is ready now.
      var t = 0;

      // register events.
      $("#newTutorialBtn").click(function () {
        $("body").addClass("iorad-loading");
        iorad.createTutorial();
        t = setTimeout(function () {
          $("body").removeClass("iorad-loading");
        }, 5000);
        $("#iorad-editor").off().load(function () {
          $("body").addClass("iorad-open");
          clearTimeout(t);
        });
      });

      iorad.on('editor:close', function (tutorialParams) {
        $("body").removeClass("iorad-open iorad-loading");
        clearTimeout(t);
        var iframeHTML = iorad.getEmbeddedPlayerUrl(
                              tutorialParams.uid,
                              tutorialParams.tutorialId,
                              tutorialParams.tutorialTitle
                           ),
            $tutorialViewStepsIframe = $(iframeHTML);
        $tutorialViewStepsIframe.attr("src", $tutorialViewStepsIframe.attr("src") + "#viewsteps");

        var pattern = /sections\/([0-9]+)\-/,
          sectionId = pattern.exec(window.location.pathname),
          SUCCESS_MSG_TEMPLATE = "<div>The solution <b>{msg}</b> has been successfully created.</div><div><a class=\"btn btn-view-article\" role=\"button\" href=\"{url}\">VIEW ARTICLE</a></div>",
          ARTICLE_URL = "/api/v2/help_center/sections/" + sectionId[1] + "/articles.json",
          articleJson = JSON.stringify({
            article: {
              "title": tutorialParams.tutorialTitle,
              "locale": HelpCenter.user.locale,
              "body": "<p>" + $tutorialViewStepsIframe.prop("outerHTML").replace(/\"/g, "'") + "</p>"
            }
          }),
          ajaxOptions = {
            dataType: 'json',
            contentType: 'application/json',
            type: 'POST',
            url: ARTICLE_URL,
            data: articleJson
          };

        $.ajax(ajaxOptions).then(function (data) {
          $.colorbox({ html: SUCCESS_MSG_TEMPLATE.replace('{msg}', data.article.title).replace('{url}', data.article.html_url) });
        }, function (err) { });
      });

    });
  }
}
// End of Iorad Widget.