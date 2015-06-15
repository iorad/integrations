(function ($, win) {
  var $container = $('.c-wrapper');
  $container.html(ioradWebWidget.templates.mainLayout() + $container.html());

  var initializeWidget = function () {
    iorad = win.iorad || {};

    var SOLUTION_CATEGORIES_API_URL = '/solution/categories.json';
    var ARTICLE_API_URL = '/solution/categories/{category_id}/folders/{folder_id}/articles.json';
    var freshdeskAjaxOption = function () {
      return {
        dataType: 'json',
        contentType: 'application/json'
      };
    };

    var listCategories = function () {
      var ajaxOptions = freshdeskAjaxOption();
      ajaxOptions.type = 'GET';
      ajaxOptions.url = SOLUTION_CATEGORIES_API_URL;
      return $.ajax(ajaxOptions);
    };

    var createArticle = function (categoryId, folderId, article) {
      var ajaxOptions = freshdeskAjaxOption();
      ajaxOptions.type = 'POST';
      ajaxOptions.url = ARTICLE_API_URL.replace('{category_id}', categoryId.toString()).replace('{folder_id}', folderId.toString());
      ajaxOptions.data = article;
      return $.ajax(ajaxOptions);
    };

    var categoryChangedHandler = function (e) {
      var $categorySelector = $(e.srcElement);
      $("#foldersList").children().each(function (index, childSelector) {
        $(childSelector).addClass("invisible-options");
      });
      $("#" + $categorySelector.val()).removeClass("invisible-options");
    };

    var populateTutorialLocation = function (data) {
      var options = '';
      var foldersSelectors = '';
      data.each(function (categoryObj) {
        options += '<option value="' + categoryObj.category.id + '">' + categoryObj.category.name + '</option>';
        var selector = '<select id="' + categoryObj.category.id + '"class="invisible-options">';
        categoryObj.category.folders.each(function (folderObj) {
          selector += '<option value="' + folderObj.id + '">' + folderObj.name + '</option>';
        });
        selector += '</select>';
        foldersSelectors += selector;
      });

      var $categorySelector = $("#categorySelector");
      $categorySelector.html(options);
      $("#foldersList").html(foldersSelectors);
      $("#" + $categorySelector.val()).removeClass("invisible-options");
      $categorySelector.click(categoryChangedHandler);
    };

    listCategories().then(populateTutorialLocation, function (err) { });

    iorad.init({ env: 'live' }, function () {
      // iorad is ready now.
      var t = 0;

      // register events
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
        $('body').removeClass('iorad-open iorad-loading');
        clearTimeout(t);
        var iframeHTML = iorad.getEmbeddedPlayerUrl(tutorialParams.uid,
                          tutorialParams.tutorialId, tutorialParams.tutorialTitle);

        var $tutorialViewStepsIframe = $(iframeHTML);

        $tutorialViewStepsIframe.attr("src", $tutorialViewStepsIframe.attr("src") + "#viewsteps");

        var categoryId = $("#categorySelector").val(),
          folderId = $("#" + categoryId).val(),
          ARTICLE_URL = "/solution/categories/{categoryId}/folders/{folderId}/articles/{id}",
          article = {
            solution_article: {
              "title": tutorialParams.tutorialTitle,
              "folder_id": folderId,
              "description": "<div>" + $tutorialViewStepsIframe.prop("outerHTML").replace(/\"/g, "'") + "</div>"
            }
          };

        var articleJson = JSON.stringify(article);

        createArticle(categoryId, folderId, articleJson).then(function (data) {
          var articleUrl = ARTICLE_URL.replace('{categoryId}', categoryId)
                                      .replace('{folderId}', folderId)
                                      .replace('{id}', data.article.id);

          // add a safe guard here.
          if ($("#successModal").length > 0) {
            $("#successModal").remove();
          }

          //$('body').append(MODAL_TEMPLATE.replace('{url}', articleUrl));
          $('body').append(ioradWebWidget.templates.freshDeskModal(articleUrl, tutorialParams.tutorialTitle));
          $("#successModal").modal('show');
        }, function (err) { });
      });

    });

  };

  var ioradLoaded = function (callback) {
    var interval = 10;
    var tryLoad = function () {
      if (win.iorad) {
        callback();
      } else {
        win.setTimeout(tryLoad, interval);
      }
    };

    win.setTimeout(tryLoad, interval);
  };

  ioradLoaded(initializeWidget);

})(jQuery, window);
