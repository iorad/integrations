(function () {
  "use strict";

  var CATEGORIES_API_URL = '/api/v2/solutions/categories';
  var FOLDERS_API_URL = '/api/v2/solutions/categories/{category_id}/folders';
  var ARTICLE_API_URL = '/api/v2/solutions/folders/{folder_id}/articles';
  var ARTICLE_URL = '/solution/articles/{id}';

  return {

    cookie: function (name, defaultval) {
      var cook = Cookies.get(name);
      if (!cook) {
        cook = defaultval;
      }

      return cook;
    },

    cookieJSON: function (name, defaultval) {
      var cook = Cookies.getJSON(name);
      if (!cook) {
        cook = defaultval;
      }

      return cook;
    },

    categories: function () {
      var defer = jQuery.Deferred();

      var retry = this.cookie('ioradapp_retry', null);
      if (retry) {
        defer.resolve(this.cookieJSON('ioradapp_categories', []));
        return defer;
      }

      var that = this;
      var categories = [];
      jQuery.when(jQuery.getJSON(CATEGORIES_API_URL)).then(function (data) {
        var promises = [];
        data.forEach(function (cat) {
          promises.push(jQuery.getJSON(FOLDERS_API_URL.replace('{category_id}', cat.id), function (folders) {
            cat.folders = folders? folders : [];
          }));
        });

        return jQuery.when.apply(jQuery, promises).done(function () {
          categories = data;
          return jQuery.Deferred().resolve(categories);
        });

      }).done(function () {
        Cookies.set('ioradapp_categories', categories, { expires: 7 });
        defer.resolve(categories);
      }).fail(function (jqXHR) {
        var retryAfter = jqXHR.getResponseHeader('Retry-After');
        if (retryAfter) {
          var now = new Date();
          Cookies.set('ioradapp_retry', categories, {
            expires: new Date(retryAfter * 1000 + now.getTime())
          });
        }

        categories = that.cookieJSON('ioradapp_categories', []);
        defer.resolve(categories);
      });

      return defer;
    },

    listCategories: function () {
      var that = this;
      jQuery.when(this.categories()).then(function (data) {
        var template = '';
        jQuery.each(data, function (index, category) {
          if (category.folders && category.folders.length > 0) {
            template += '<optgroup label="' + category.name + '">';
            category.folders.each(function (folder) {
              template += '<option value="' + folder.id + '" data-category-id="' + category.id + '" ' +
                'data-folder-id="' + folder.id + '">'+ folder.name + '</option>';
            });
            template += '</optgroup>';
          }
        });

        template = template ? template : '<option>No data available</option>';
        jQuery(that.$container).find('[name="category"]').html(template).addClass('select2');
        jQuery(that.$container).find('.loading-box').addClass('hide');
        jQuery(that.$container).find('.content').removeClass('hide');
      });
    },

    initialize: function () {
      if (page_type === "ticket") {
        appPlaceholder.ticket.belowRequestorInfo(jQuery(this.$container));

        var that = this;
        var options = { dataType: "script", cache: true };
        var promises = [
          jQuery.ajax(jQuery.extend(options, { url: 'https://iorad.com/server/assets/js/iorad.js' })),
          jQuery.ajax(jQuery.extend(options, { url: 'https://cdnjs.cloudflare.com/ajax/libs/js-cookie/2.1.3/js.cookie.min.js' })),
          jQuery.ajax(jQuery.extend(options, { url: 'https://cdnjs.cloudflare.com/ajax/libs/bootbox.js/4.4.0/bootbox.min.js' })),
        ];

        jQuery.when.apply(jQuery, promises).done(function () {
          that.ioradLoaded();
          that.listCategories();
        });
      }
    },

    initApp: function () {
      var $container = this.$container;
      var $pageBody = jQuery($container).closest("body");
      var $solutionForm = jQuery($container).find(".iorad-solution");
      var openReplyArea = function () {
        if ($pageBody.find(".redactor_editor div").length == 0) {
          $pageBody.find('#FwdButton').first().click();
        }
      };

      iorad.init({env: "live", pluginType: "iorad_freshdesk_app_ticketing"}, function () {
        // register events
        $solutionForm.on('submit', function (e) {
          e.preventDefault();

          bootbox.hideAll();
          $pageBody.addClass("iorad-loading");
          iorad.createTutorial();

          $pageBody.find("#iorad-editor").off().load(function () {
            $pageBody.removeClass("iorad-loading").addClass("iorad-open");
          });
        });

        iorad.on("editor:close", function (tutorialParams) {
          var category = jQuery($container).find("[name='category'] option:selected");
          var folderId = category.data('folder-id');
          var isdraft = jQuery($container).find("[name='draft']").is(':checked');
          var addToTicket = jQuery($container).find("[name='ticket']").is(':checked');

          var iframeHTML = iorad.getEmbeddedPlayerUrl(tutorialParams.uid, tutorialParams.tutorialId, tutorialParams.tutorialTitle);
          iframeHTML = "<p style='border: 2px solid #ebebeb; border-bottom: none;'>" + iframeHTML + "</p>";

          if (addToTicket) {
            openReplyArea();
            $pageBody.find(".redactor_editor div").append(iframeHTML);
          }

          jQuery.ajax({
            url: ARTICLE_API_URL.replace('{folder_id}', folderId),
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            headers: { 'Authorization': 'Basic ' + btoa('{{iparam.freshdesk_apikey}}') },
            data: JSON.stringify({
              "title": tutorialParams.tutorialTitle,
              "description": iframeHTML,
              "status": isdraft ? 1 : 2,
              "type": 1 // permanent
            }),
            error: function(jqXHR) {
              var message = jqXHR.status === 401 ?
                'Please review your API key in freshdesk app param.' : jqXHR.responseJSON.message;
              $pageBody.removeClass("iorad-open iorad-loading");
              bootbox.alert({
                title: 'Error while creating tutorial',
                message: message,
                closeButton: false,
                buttons: { ok: { label: 'Close' }}
              });
              $pageBody.find('.modal.bootbox').css({
                width: '30vw',
                margin: '-15vh 0 0 -15vw'
              });
            },
            success: function(data) {
              var message = "<b>" + tutorialParams.tutorialTitle + "</b> ";
              if (isdraft) {
                message += "(draft) ";
              }
              message += "published to <b>" + category.text() + "</b> ";

              if (addToTicket) {
                message += "and attached to the ticket";
              }

              message = message.trim() + "." + " To view the article, please click " +
                "<a href='" + ARTICLE_URL.replace('{id}', data.id) + "' target='_blank'>this link</a>.";
              $pageBody.removeClass("iorad-open iorad-loading");
              bootbox.alert({
                title: 'Success creating tutorial',
                message: message,
                closeButton: false,
                buttons: { ok: { label: 'Close' }}
              });
              $pageBody.find('.modal.bootbox').css({
                width: '30vw',
                margin: '-15vh 0 0 -15vw'
              });
            }
          });
        });
      });
    },
  };
})();