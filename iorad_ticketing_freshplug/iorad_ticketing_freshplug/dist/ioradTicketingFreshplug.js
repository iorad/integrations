/*! iorad-ticketing-freshplug - v1.0.0 - 11-05-2015 */CustomWidget.include_js("//iorad.com/server/assets/js/iorad.js");
CustomWidget.include_js("//cdnjs.cloudflare.com/ajax/libs/handlebars.js/3.0.3/handlebars.min.js");

var ioradFreshplug = (function (module, undefined) {
  module = {
    util: {},
    templates: {},
    requests: {},
    addToKnowledgebase: false,
    markAsPublished: true,
    categories: [],
    selectedCategoryId: undefined,
    foldersDictionary: {},
    // stupid request, I hope this gets removed.
    freshplug_webwidgetmode: false
    // end stupid.
  };

  return module;
})(ioradFreshplug || {});
;var initTemplate = function () {;this["JST"] = this["JST"] || {};

this["JST"]["templates/hyperLinkTemplate.hbs"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<a href=\""
    + alias3(((helper = (helper = helpers.href || (depth0 != null ? depth0.href : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"href","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.content || (depth0 != null ? depth0.content : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"content","hash":{},"data":data}) : helper)))
    + "</a>";
},"useData":true});

this["JST"]["templates/inputControlTemplate.hbs"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return " checked";
},"3":function(depth0,helpers,partials,data) {
    var stack1;

  return "    <div class=\"input-control\">\r\n        <label for=\"selectCategory\">Categories<span class=\"required_star\">*</span></label>\r\n        <select class=\"categoryOptions field\" id=\"categorySelector\">\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.categories : depth0),{"name":"each","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </select>\r\n    </div>\r\n    <div class=\"input-control\">\r\n        <label for=\"selectSection\">Solutions<span class=\"required_star\">*</span></label>\r\n        <select class=\"sectionOptions\" id=\"folderSelector\">\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.folders : depth0),{"name":"each","hash":{},"fn":this.program(7, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </select>\r\n    </div>\r\n    <div class=\"input-control\">\r\n        <input id=\"markAsPublished\" type=\"checkbox\" "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.markAsPublished : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "> Automatically mark new tutorial as published.\r\n    </div>\r\n";
},"4":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <option value=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\""
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.checked : depth0),{"name":"if","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ">\r\n                "
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "\r\n            </option>\r\n";
},"5":function(depth0,helpers,partials,data) {
    return " selected ";
},"7":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <option value=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "</option>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"body-input-control\">\r\n    <div class=\"input-control\">\r\n        <input type=\"checkbox\" id=\"addToKnowledgebaseToggle\" "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.addToKnowledgebase : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "> Auto-add Solution to Knowledge Base\r\n    </div>\r\n    <div class=\"loading hide\">loading...</div>\r\n\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.addToKnowledgebase : depth0),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\r\n    <div class=\"input-control\">\r\n        <button id=\"newTutorial\" class=\"btn btn-iorad-widget btn-primary\" title=\"CAPTURE SOLUTION\">CAPTURE SOLUTION</button>\r\n    </div>\r\n</div>\r\n";
},"useData":true});

this["JST"]["templates/insertIoradButtonTemplate.hbs"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<li class=\"redactor_separator\"></li>\r\n<li>\r\n	<a href=\"#\" class=\"insert_iorad tooltip\" data-editor-id=\"cnt-reply-body\" rel=\"ticket_iorad\" data-original-title=\"Insert Iorad Screen Capture\">Iorad</a>\r\n</li>\r\n";
},"useData":true});

this["JST"]["templates/insertKnowledgebaseSolutionButtonTemplate.hbs"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<li class=\"ticket-btns\">\r\n    <div id=\"insertIoradToKnowledgebaseButton\" class=\"btn tooltip\"\r\n         data-original-title=\"Iorad\" twipsy-content-set=\"true\">\r\n        <img src=\"//iorad.com/server/assets/img/icon_iorad_freshdesk.png\" style=\"height: 14px;\" />\r\n        <span> Create Knowledgebase solution</span>\r\n    </div>\r\n</li>\r\n";
},"useData":true});

this["JST"]["templates/insertSolutionModal.hbs"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"modal fade in\" role=\"dialog\" aria-hidden=\"false\" id=\"insert_iorad_solution\" style=\"width: 710px; margin-left: -355px;\">\r\n    <div class=\"modal-header\">\r\n        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\"></button>\r\n        <h3 class=\"ellipsis modal-title\" title=\"Iorad Screen Capture\">Iorad Screen Capture</h3>\r\n    </div>\r\n    <div class=\"modal-body\">\r\n    </div>\r\n</div>\r\n";
},"useData":true});

this["JST"]["templates/knowledgebaseArticleCreatedModal.hbs"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return " and a link has been attached to the ticket";
},"3":function(depth0,helpers,partials,data) {
    return "Return to ticket";
},"5":function(depth0,helpers,partials,data) {
    return "Close";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"modal fade iorad-widget-modal\" role=\"dialog\" id=\"successModal\" aria-hidden=\"false\">\r\n    <div class=\"modal-header\">\r\n        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\"></button>\r\n        <h3 class=\"ellipsis modal-title\">Article Created!</h3>\r\n    </div>\r\n    <div class=\"modal-body\">\r\n        The solution <b>"
    + alias3(((helper = (helper = helpers.articleTitle || (depth0 != null ? depth0.articleTitle : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"articleTitle","hash":{},"data":data}) : helper)))
    + "</b> has been successfully created"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.freshplugTicketingView : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ".\r\n    </div>\r\n    <div class=\"modal-footer\">\r\n        <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.freshplugTicketingView : depth0),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.program(5, data, 0),"data":data})) != null ? stack1 : "")
    + "</button>\r\n        <a class=\"btn btn-primary\" href=\""
    + alias3(((helper = (helper = helpers.articleHref || (depth0 != null ? depth0.articleHref : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"articleHref","hash":{},"data":data}) : helper)))
    + "\">VIEW ARTICLE</a>\r\n    </div>\r\n</div>\r\n";
},"useData":true});;ioradFreshplug.templates = (function (module, win, undefined) {
  module.insertIoradButtonTemplate = function () {
    var template = win["JST"]["templates/insertIoradButtonTemplate.hbs"];
    return template();
  };

  module.inputControlTemplate = function (inputControlData) {
    var template = win["JST"]["templates/inputControlTemplate.hbs"];
    return template({
      categories: inputControlData.categories,
      folders: inputControlData.folders,
      addToKnowledgebase: inputControlData.addToKnowledgebase,
      markAsPublished: inputControlData.markAsPublished
    });
  };

  module.insertSolutionModal = function () {
    var template = win["JST"]["templates/insertSolutionModal.hbs"];
    return template();
  };

  module.getHyperLink = function (href, content) {
    var template = win["JST"]["templates/hyperLinkTemplate.hbs"];
    return template({ href: href, content: content });
  };

  module.addToKnowledgebaseButtonTemplate = function () {
    var template = win["JST"]["templates/insertKnowledgebaseSolutionButtonTemplate.hbs"];
    return template();
  };

  // display a modal indicating that article is successfully created in knowledge base.
  module.articleCreatedModalTemplate = function (article, isTicketingView) {
    var template = win["JST"]["templates/knowledgebaseArticleCreatedModal.hbs"];
    return template({ articleTitle: article.title, articleHref: article.href, freshplugTicketingView: isTicketingView});
  };

  return module;
})(ioradFreshplug.templates || {}, window);
;};;ioradFreshplug.requests = (function (module, $, undefined) {

  var SOLUTION_CATEGORIES_API_URL = "/solution/categories.json",
    ARTICLE_API_URL = "/solution/categories/{category_id}/folders/{folder_id}/articles.json",
    getAjaxOption = function () {
      return {
        dataType: "json",
        contentType: "application/json"
      };
    };

  module.listCategories = function () {
    var ajaxOptions = getAjaxOption();
    ajaxOptions.type = "GET";
    ajaxOptions.url = SOLUTION_CATEGORIES_API_URL;
    return $.ajax(ajaxOptions);
  };

  module.createArticle = function (categoryId, folderId, article) {
    var ajaxOptions = getAjaxOption();
    ajaxOptions.type = "POST";
    ajaxOptions.url = ARTICLE_API_URL
                        .replace("{category_id}", categoryId.toString())
                        .replace("{folder_id}", folderId.toString());
    ajaxOptions.data = article;
    return $.ajax(ajaxOptions);
  };

  return module;
})(ioradFreshplug.requests || {}, jQuery);
;var initializeFreshplug = function () {

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
