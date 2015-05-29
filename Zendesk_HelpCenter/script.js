// Iorad Widget starts here.
function ioradWidget() {
  var $ioradWidget = $(".iorad-widget"),
      canEditHelpCenter = HelpCenter.user.role == "agent" || HelpCenter.user.role == "manager";

  if ($ioradWidget.length == 1 && canEditHelpCenter) {
    var iorad = window.iorad || {},
        CATEGORIES_API_URL = '/api/v2/help_center/categories.json',
        SECTIONS_API_URL = '/api/v2/help_center/categories/{id}/sections.json',
        CREATE_ARTICLE_API_URL = ARTICLE_URL = '/api/v2/help_center/sections/{id}/articles.json',
        categories = [];

    var zendeskAjaxOptions = function () {
      return {
        dataType: 'json',
        contentType: 'application/json',
      };
    };
    
    var listCategories = function () {
      var ajaxOptions = zendeskAjaxOptions();
      ajaxOptions.url = CATEGORIES_API_URL;
      ajaxOptions.type = 'GET';
      return $.ajax(ajaxOptions);
    };

    var listSections = function (categoryId) {
      var ajaxOptions = zendeskAjaxOptions();
      ajaxOptions.url = SECTIONS_API_URL.replace('{id}', categoryId.toString());
      ajaxOptions.type = 'GET';
      return $.ajax(ajaxOptions);
    };

    var createArticle = function(sectionId, articleJson) {
      var ajaxOptions = zendeskAjaxOptions();
      ajaxOptions.url = CREATE_ARTICLE_API_URL.replace('{id}', sectionId.toString());
      ajaxOptions.type = 'POST';
      ajaxOptions.data = articleJson;
      return $.ajax(ajaxOptions);
    }

    var categoryChangedHandler = function (e) {
      var $categorySelector = $(e.toElement);
      debugger;
      $("#sectionsList").children().each(function (index, childSelector) {
        $(childSelector).addClass("invisible-options");
      });
      $("#" + $categorySelector.val()).removeClass("invisible-options");
    };

    var populateTutorialSections = function (data) {
      var sections = data.sections;
      var options = '';
      if (sections.length > 0) {
        sections.forEach(function(sectionObj) {
          options += '<option value="' + sectionObj.id + '">' + sectionObj.name + '</option>'
        });

        $("#" + sections[0].category_id).html(options);

      }

    };

    var populateTutorialLocation = function (data) {
      var options = '';
      var sectionsSelectors = '';
      
      data.categories.forEach(function (categoryObj) {
        options += '<option value="' + categoryObj.id + '">' + categoryObj.name + '</option>';
        sectionsSelectors += '<select id="' + categoryObj.id + '"class="invisible-options"></select>';
      });

      var $categorySelector = $("#categorySelector");
      $categorySelector.html(options);
      $("#sectionsList").html(sectionsSelectors);

      data.categories.forEach(function(categoryObj) {
        listSections(categoryObj.id).then(populateTutorialSections, function (err) { });
      });
      
      $("#" + $categorySelector.val()).removeClass("invisible-options");
      $categorySelector.click(categoryChangedHandler);
    };

    listCategories().then(populateTutorialLocation, function (err) { });
    
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
        var iframeHTML               = iorad.getEmbeddedPlayerUrl(
                                         tutorialParams.uid,
                                         tutorialParams.tutorialId,
                                         tutorialParams.tutorialTitle
                                       ),
            $tutorialViewStepsIframe = $(iframeHTML),
            categoryId               = $("#categorySelector").val(),
            sectionId                = $("#" + categoryId).val(),
            SUCCESS_MSG_TEMPLATE     = "<div>The solution <b>{msg}</b> has been successfully created.</div><div><a class=\"btn btn-view-article\" role=\"button\" href=\"{url}\">VIEW ARTICLE</a></div>";

        $tutorialViewStepsIframe.attr("src", $tutorialViewStepsIframe.attr("src") + "#viewsteps");
        
        var articleJson = JSON.stringify({
          article: {
            "title": tutorialParams.tutorialTitle,
            "locale": HelpCenter.user.locale,
            "body": "<p>" + $tutorialViewStepsIframe.prop("outerHTML").replace(/\"/g, "'") + "</p>"
          }
        });

        createArticle(sectionId, articleJson).then(function (data) {
          $.colorbox({ html: SUCCESS_MSG_TEMPLATE.replace('{msg}', data.article.title).replace('{url}', data.article.html_url) });
        }, function (err) { });
      });

    });
  }
}

ioradWidget();
// End of Iorad Widget.
