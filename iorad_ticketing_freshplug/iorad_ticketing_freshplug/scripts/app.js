var initializeFreshplug = function () {

  iorad = window.iorad || {};

  jQuery(".redactor_insert_btns ul").append(ioradFreshplug.templates.insertIoradButtonTemplate());

  $ticketActionsButtons = jQuery(".ticket-actions ul");

  $ticketActionsButtons.html(ioradFreshplug.templates.addToKnowledgebaseButtonTemplate() + $ticketActionsButtons.html());
  
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

        // stupid request. I hope I can remove it.
        if (ioradFreshplug.freshplug_webwidgetmode) {
          showToggleButton(false);
        }

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
            processCategoriesAndFolders(data);
            loadModalBody();
          }, function (err) {});
        } else {
          loadModalBody();
        }
      },

      onIoradEditorClosed = function (tutorialParams) {
        $bodyHTML.removeClass("iorad-open iorad-loading");
        clearTimeout(t);

        // Hide modal.
        jQuery("#insert_iorad_solution").modal('hide');

        var iframeHTML = iorad.getEmbeddedPlayerUrl(tutorialParams.uid,
              tutorialParams.tutorialId, tutorialParams.tutorialTitle),
          $editorMessageBody = jQuery(".redactor_editor div");

        if (ioradFreshplug.addToKnowledgebase) {
          var $tutorialIframe = jQuery(iframeHTML),
            categoryId = ioradFreshplug.selectedCategoryId,
            folderId = +jQuery("#folderSelector").val(),
            ARTICLE_URL = "/solution/categories/{categoryId}/folders/{folderId}/articles/{id}",
            statusCode = ioradFreshplug.markAsPublished ? 2 : 1,
            articleDescription = "<div>" + $tutorialIframe.prop("outerHTML").replace(/\"/g, "'") + "</div>";

          tutorialParams.steps.each(function (step) {
            articleDescription += "<div style='display: none;'>" + step.description + "</div>";
          });
          
          var article = {
              solution_article: {
                "title": tutorialParams.tutorialTitle,
                "folder_id": folderId,
                "description": articleDescription,
                "status": statusCode
              }
            },
            articleJson = JSON.stringify(article);

          ioradFreshplug.requests.createArticle(categoryId, folderId, articleJson).then(function (data) {
            var articleUrl = ARTICLE_URL.replace('{categoryId}', categoryId)
              .replace('{folderId}', folderId)
              .replace('{id}', data.article.id);
            if ($editorMessageBody.length > 0 && !ioradFreshplug.freshplug_webwidgetmode) {
              $editorMessageBody.append("<p>This solution article should help you: "
                                        + ioradFreshplug.templates.getHyperLink(articleUrl, tutorialParams.tutorialTitle)
                                        + "</p>");
              var $existingModal = jQuery("#successModal");

              if ($existingModal.length > 0) {
                $existingModal.remove();
              }

              jQuery("body").append(ioradFreshplug.templates.articleCreatedModalTemplate({ title: tutorialParams.tutorialTitle, href: articleUrl }, true));
              jQuery("#successModal").modal({ backdrop: true, show: true });

            } else {
              var $existingModal = jQuery("#successModal");

              if ($existingModal.length > 0) {
                $existingModal.remove();
              }

              jQuery("body").append(ioradFreshplug.templates.articleCreatedModalTemplate({ title: tutorialParams.tutorialTitle, href: articleUrl }, false));
              jQuery("#successModal").modal({ backdrop: true, show: true });
            }
          });
        } else {
          $editorMessageBody.append("<p>" + iframeHTML + "</p>");
        }
      },

      processCategoriesAndFolders = function (data) {
        ioradFreshplug.categories = [];
        ioradFreshplug.foldersDictionary = {};

        data.each(function (obj) {
          ioradFreshplug.categories.push({ id: obj.category.id, name: obj.category.name, checked: false });
          ioradFreshplug.foldersDictionary[obj.category.id] = obj.category.folders;
        });

        ioradFreshplug.categories[0].checked = true;
        ioradFreshplug.selectedCategoryId = ioradFreshplug.categories[0].id;
      },

      showToggleButton = function (canShow) {
        var $toggleButton = jQuery("#addToKnowledgebaseToggle");

        canShow ? $toggleButton.removeClass("hide") : $toggleButton.addClass("hide");
      },

      displayInsertSolutionModal = function (event) {
        event.preventDefault();
        
        ioradFreshplug.freshplug_webwidgetmode = false;

        if (jQuery("body #insert_iorad_solution").length === 0) {
          jQuery("body").append(ioradFreshplug.templates.insertSolutionModal());

          var inputControlData = {
            categories: ioradFreshplug.categories,
            folders: ioradFreshplug.selectedCategoryId ? ioradFreshplug.foldersDictionary[ioradFreshplug.selectedCategoryId] : [],
            addToKnowledgebase: ioradFreshplug.addToKnowledgebase,
            markAsPublished: ioradFreshplug.markAsPublished
          }

          jQuery("#insert_iorad_solution .modal-body").html(ioradFreshplug.templates.inputControlTemplate(inputControlData));

          registerEvents();
        }

        showToggleButton(true);

        // show modal
        jQuery("#insert_iorad_solution").modal({ backdrop: true, show: true });
      },

      displayAddToKnowledgebaseModal = function (event) {
        event.preventDefault();

        ioradFreshplug.addToKnowledgebase = true;
        ioradFreshplug.freshplug_webwidgetmode = true;

        if (jQuery("body #insert_iorad_solution").length === 0) {
          jQuery("body").append(ioradFreshplug.templates.insertSolutionModal());
        }

        ioradFreshplug.requests.listCategories().then(function (data) {
          processCategoriesAndFolders(data);
          loadModalBody();
          
          jQuery("#insert_iorad_solution").modal({ backdrop: true, show: true });
        }, function (err) {});
      };
    
    // register events
    jQuery(".insert_iorad").click(displayInsertSolutionModal);
    jQuery("#insertIoradToKnowledgebaseButton").click(displayAddToKnowledgebaseModal);
    iorad.on("editor:close", onIoradEditorClosed);

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
