ioradWebWidget.freshdesk = (function (module) {

  module.runApp = function ($, win) {
    var $container = $('.c-wrapper');
    $container.html(ioradWebWidget.templates.freshdeskTemplates.mainLayout() + $container.html());

    var initializeWidget = function () {
      iorad = win.iorad || {};

      var listCategories = function () {
        return $.ajax(ioradWebWidget.util.freshdesk.listCategories());
      };

      var createArticle = function (categoryId, folderId, article) {
        return $.ajax(ioradWebWidget.util.freshdesk.createArticle(categoryId, folderId, article));
      };

      var categoryChangedHandler = function (e) {
        var $categorySelector = $(e.srcElement);
        $("#foldersList").children().each(function (index, childSelector) {
          $(childSelector).addClass("invisible-options");
        });
        $("#" + $categorySelector.val()).removeClass("invisible-options");
      };

      var populateTutorialLocation = function (data) {
        var categories = [];
        data.each(function (categoryObj) {
          categories.push(
          {
            id: categoryObj.category.id,
            name: categoryObj.category.name,
            folders: categoryObj.category.folders
          });
        });

        var $categorySelector = $("#categorySelector");
        $categorySelector.html(ioradWebWidget.templates.freshdeskTemplates.categoryOptionTemplate(categories));
        $("#foldersList").html(ioradWebWidget.templates.freshdeskTemplates.folderListTemplate(categories));
        $("#" + $categorySelector.val()).removeClass("invisible-options");
        $categorySelector.click(categoryChangedHandler);
      };

      listCategories().then(populateTutorialLocation, function (err) {});

      iorad.init({ env: 'prod' }, function () {
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
          
          var categoryId = $("#categorySelector").val(),
            folderId = $("#" + categoryId).val(),
            statusCode = $("#markAsPublished").is(":checked") ? 2 : 1,
            article = {
              solution_article: {
                "title": tutorialParams.tutorialTitle,
                "folder_id": folderId,
                // steps contains a list of the steps embedded in the iframe, this is used to provider rich web search in the knowledge base
                "description": ioradWebWidget.templates.freshdeskTemplates.articleTemplate($tutorialViewStepsIframe.attr("src") + "#viewsteps", tutorialParams.steps).replace(/\"/g, "'"),
                "status": statusCode
              }
            };

          var articleJson = JSON.stringify(article);

          createArticle(categoryId, folderId, articleJson).then(function (data) {
            var articleMetaData = {
              id: data.article.id,
              categoryId: categoryId,
              folderId: folderId
            };
            // add a safe guard here.
            if ($("#successModal").length > 0) {
              $("#successModal").remove();
            }

            $('body').append(ioradWebWidget.templates.freshdeskTemplates.freshDeskModal(articleMetaData, tutorialParams.tutorialTitle));
            $("#successModal").modal('show');
          }, function (err) {});
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

  };

  return module;
})(ioradWebWidget.freshdesk || {});
