/*! IoradWebWidget - v0.0.1 - 06-17-2015 */this["JST"] = this["JST"] || {};

this["JST"]["templates/mainLayout.hbs"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<section id=\"ioradWidget\" class=\"content rounded-6 iorad-widget hide-in-mobile\" title=\"Iorad Tutorial Widget\">\n    <div id=\"tutorialLocation\" class=\"widget-layout\">\n        <div class=\"widget-header\"><h2 class=\"heading\">Create a Solution</h2></div>\n        <div class=\"widget-location-selector\"><div class=\"selector-label\"><h4>Categories</h4></div><div><select id=\"categorySelector\"></select></div></div>\n        <div class=\"widget-location-selector\"><div class=\"selector-label\"><h4>Solutions</h4></div><div id='foldersList'></div></div>\n        <div id=\"control\">\n            <a id='newTutorialBtn' class='btn btn-iorad-widget' title='open IORAD editor' href='#'>ADD</a>\n        </div>\n    </div>\n</section>\n<style>\n    .invisible-options {\n        display: none;\n    }\n\n    .iorad-widget {\n        border-bottom: 1px solid #e5e5e5;\n    }\n\n        .iorad-widget div {\n            display: inline-block;\n        }\n\n    #control {\n        float: right;\n        position: relative;\n    }\n\n    .widget-layout {\n        width: 98%;\n    }\n\n    .widget-header {\n        padding-right: 2em;\n    }\n\n    .widget-location-selector {\n        padding-right: 2em;\n        height: 30px;\n    }\n\n        .widget-location-selector .selector-label {\n            padding-right: 1em;\n        }\n\n    .btn-iorad-widget {\n        color: #006063;\n        border-color: #006063;\n        font-weight: bold;\n        background-color: white;\n        background-image: none;\n        text-shadow: none;\n        width: 112px;\n        line-height: 20px;\n        margin: 0 auto;\n        display: block;\n    }\n\n    .iorad-widget-modal {\n        width: 28%;\n        font-size: 16px;\n    }\n</style>\n<script type='text/javascript' src='//iorad.com/server/assets/js/iorad.js'></script>\n";
},"useData":true});

this["JST"]["templates/modalTemplate.hbs"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"modal hide fade iorad-widget-modal\" role=\"dialog\" id=\"successModal\" aria-hidden=\"true\" style=\"display:none;\">\n    <div class=\"modal-header\"></div>\n    <div class=\"modal-body\">\n        <div id=\"successMsg\">\n            The solution <b>"
    + alias3(((helper = (helper = helpers.articleTitle || (depth0 != null ? depth0.articleTitle : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"articleTitle","hash":{},"data":data}) : helper)))
    + "</b> has been successfully created.\n        </div>\n    </div><div class=\"modal-footer\">\n        <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button><a class=\"btn btn-primary\" href=\""
    + alias3(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"url","hash":{},"data":data}) : helper)))
    + "\">VIEW ARTICLE</a>\n    </div>\n</div>\n";
},"useData":true});;/**
 * try to find me.
 */
var ioradWebWidget = (function (module, undefined) {
  module = {
    freshdesk: {},
    config: {},
    util: {},
    templates: {}
  };

  return module;
})(ioradWebWidget || {});

ioradWebWidget.templates = {
  // main layout for iorad widget control. At the moment, this widget control works best with the new freshtheme.
  mainLayout: function () {
    var template = JST['templates/mainLayout.hbs'];
    return template();
  },

  // This modal shows up when there is a new fresh desk article created successfully. Pass in the url as parameter.
  freshDeskModal: function (url, title) {
    var template = JST['templates/modalTemplate.hbs'];
    return template({url: url, articleTitle: title});
  }
};
;(function ($, win) {
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
