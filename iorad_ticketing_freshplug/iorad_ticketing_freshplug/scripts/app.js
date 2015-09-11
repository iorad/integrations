var initializeFreshplug = function () {

  iorad = window.iorad || {};

  var $insertButtonsList = jQuery(".redactor_insert_btns ul");
  $insertButtonsList.append(ioradFreshplug.templates.insertIoradButtonTemplate());

  $insertIoradButton = jQuery(".insert_iorad");
  
  iorad.init({ env: "live", pluginType: "freshplug_ticketing" }, function () {
    var t = 0,
      $bodyHTML = jQuery("body"),

      loadIoradEditor = function () {
        $bodyHTML.addClass("iorad-loading");
        iorad.createTutorial();
        t = setTimeout(function () {
          $bodyHTML.removeClass("iorad-loading");
        }, 5000);

        jQuery("#iorad-editor").off().load(function () {
          $bodyHTML.addClass("iorad-open");
          clearTimeout(t);
        });
      },

      registerEvents = function () {
        jQuery("#newTutorial").click(loadIoradEditor);
        jQuery("#categorySelector").change(onCategorySelectionChanged);
        jQuery("#addToKnowledgebaseToggle").change(onAddToKnowledgebaseToggleChanged);
        jQuery("#markAsPublished").change(onMarkAsPublishedChanged);
      },

      loadModalBody = function () {
        jQuery("#insert_iorad_solution .modal-body").html(ioradFreshplug.templates.inputControlTemplate({
          categories: ioradFreshplug.categories,
          folders: ioradFreshplug.foldersDictionary[ioradFreshplug.selectedCategoryId],
          addToKnowledgebase: ioradFreshplug.addToKnowledgebase,
          markAsPublished: ioradFreshplug.markAsPublished
        }));

        // register event
        registerEvents();
      },

      onCategorySelectionChanged = function (e) {
        ioradFreshplug.selectedCategoryId = +e.srcElement.value;

        ioradFreshplug.categories.each(function (category) { category.checked = category.id === ioradFreshplug.selectedCategoryId });

        loadModalBody();
      },

      onMarkAsPublishedChanged = function () {
        ioradFreshplug.markAsPublished = jQuery(this).is(":checked");
      },

      onAddToKnowledgebaseToggleChanged = function () {
        ioradFreshplug.addToKnowledgebase = jQuery(this).is(":checked");
        jQuery("#insert_iorad_solution .body-input-control .loading").removeClass("hide");

        //load categories.
        if (ioradFreshplug.categories.length === 0) {
          ioradFreshplug.requests.listCategories().then(function (data) {
            ioradFreshplug.categories = [];
            ioradFreshplug.foldersDictionary = {};

            data.each(function (obj) {
              ioradFreshplug.categories.push({ id: obj.category.id, name: obj.category.name, checked: false });
              ioradFreshplug.foldersDictionary[obj.category.id] = obj.category.folders;
            });

            ioradFreshplug.categories[0].checked = true;
            ioradFreshplug.selectedCategoryId = ioradFreshplug.categories[0].id;

            loadModalBody();
          }, function (err) {});
        } else {
          loadModalBody();
        }
      },

      displayInsertSolutionModal = function () {
        if (jQuery("body #insert_iorad_solution").length === 0) {
          jQuery("body").append(ioradFreshplug.templates.insertSolutionModal());

          var inputControlData = {
            categories: ioradFreshplug.categories,
            folders: ioradFreshplug.selectedCategoryId ? ioradFreshplug.foldersDictionary[ioradFreshplug.selectedCategoryId] : [],
            addToKnowledgebase: ioradFreshplug.addToKnowledgebase,
            markAsPublished: ioradFreshplug.markAsPublished
          }

          jQuery("#insert_iorad_solution .modal-body").html(ioradFreshplug.templates.inputControlTemplate(inputControlData));

          // register event
          registerEvents();
        }

        // show modal
        jQuery("#insert_iorad_solution").modal({ backdrop: true, show: true });
      };
    
    // register events
    jQuery(".insert_iorad").click(displayInsertSolutionModal);
    
    iorad.on("editor:close", function (tutorialParams) {
      $bodyHTML.removeClass("iorad-open iorad-loading");
      clearTimeout(t);

      var iframeHTML = iorad.getEmbeddedPlayerUrl(tutorialParams.uid,
                                   tutorialParams.tutorialId, tutorialParams.tutorialTitle),
        $editorMessageBody = jQuery(".redactor_editor div");

      if (ioradFreshplug.addToKnowledgebase) {
        var $tutorialIframe = jQuery(iframeHTML),
          categoryId = ioradFreshplug.selectedCategoryId,
          folderId = jQuery("#folderSelector").val(),
          ARTICLE_URL = "/solution/categories/{categoryId}/folders/{folderId}/articles/{id}",
          statusCode = ioradFreshplug.markAsPublished ? 2 : 1,
          article = {
            solution_article: {
              "title": tutorialParams.tutorialTitle,
              "folder_id": folderId,
              "description": "<div>" + $tutorialIframe.prop("outerHTML").replace(/\"/g, "'") + "</div>",
              "status": statusCode
            }
          },
          articleJson = JSON.stringify(article);

        ioradFreshplug.requests.createArticle(categoryId, folderId, articleJson).then(function (data) {
          var articleUrl = ARTICLE_URL.replace('{categoryId}', categoryId)
                                      .replace('{folderId}', folderId)
                                      .replace('{id}', data.article.id);

          $editorMessageBody.append("<p>knowledgebase article: " + ioradFreshplug.templates.getHyperLink(articleUrl, tutorialParams.tutorialTitle) + "</p>");
        });
      } else {
        $editorMessageBody.append("<p>" + iframeHTML + "</p>");
      }

      // Hide modal.
      jQuery("#insert_iorad_solution").modal('hide');
    });
  });
};

var freshPlugInit = function () {
  initTemplate();
  initializeFreshplug();
};

var CustomWidgetLoaded = function (callback) {
  var interval = 10;
  var tryLoad = function () {
    if (window.iorad && window.Handlebars) {
      callback();
    } else {
      window.setTimeout(tryLoad, interval);
    }
  };

  window.setTimeout(tryLoad, interval);
};

CustomWidgetLoaded(freshPlugInit);
