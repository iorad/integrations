(function () {
  "use strict";

  var CATEGORIES_API_URL = '/api/v2/solutions/categories';
  var FOLDERS_API_URL = '/api/v2/solutions/categories/{category_id}/folders';
  var ARTICLE_API_URL = '/api/v2/solutions/folders/{folder_id}/articles';
  var ARTICLE_URL = '/solution/articles/{id}';

  return {

    getFreshdeskApiUrl: function () {
      return "https://" + domHelper.getDomainName();
    },

    doNothingCallback: function() {
      // Do nothing
    },

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
            cat.folders = folders ? folders : [];
          }));
        });

        return jQuery.when.apply(jQuery, promises).done(function () {
          categories = data;
          return jQuery.Deferred().resolve(categories);
        });

      }).done(function () {
        Cookies.set('ioradapp_categories', categories, {expires: 7});
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
                'data-folder-id="' + folder.id + '">' + folder.name + '</option>';
            });
            template += '</optgroup>';
          }
        });

        template = template ? template : '<option>No data available</option>';
        jQuery(that.$container).find('[name="category"]').html(template).addClass('select2');
        jQuery(that.$container).find('.loading-box').addClass('hide');
        jQuery(that.$container).find('.content').removeClass('hide');

        var correntDomain = domHelper.getDomainName();
        if (correntDomain !== "{{iparam.freshdesk_domain}}") {
          var errorMessage = "Error: your domain should be " + correntDomain +
            ". Please correct it on installation param.";
          jQuery(that.$container).find('.content').html(errorMessage);
        }
      });
    },

    initialize: function () {
      if (page_type === "ticket") {
        appPlaceholder.ticket.belowRequestorInfo(jQuery(this.$container));

        var that = this;
        var options = {dataType: "script", cache: true};
        var promises = [
          jQuery.ajax(jQuery.extend(options, {url: 'https://iorad.com/server/assets/js/iorad.js'})),
          jQuery.ajax(jQuery.extend(options, {url: 'https://cdnjs.cloudflare.com/ajax/libs/js-cookie/2.1.3/js.cookie.min.js'}))
        ];

        jQuery.when.apply(jQuery, promises).done(function () {
          that.loadIorad();
          that.listCategories();
        });
      }
    },

    loadIorad: function () {
      var that = this;
      var $container = that.$container;
      var $pageBody = jQuery($container).closest("body");
      var $solutionForm = jQuery($container).find(".iorad-solution");
      var createEvent = null;

      iorad.init({env: "live", pluginType: "iorad_freshdesk_app_ticketing"}, function () {

        // register events
        $solutionForm.on('submit', function (e) {
          e.preventDefault();

          createEvent = e;
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
          var addToTicket = jQuery($container).find("[name='add_to_ticket']:checked").val();

          var tutorialTitle = tutorialParams.tutorialTitle.replace('-', ' ');
          var iframeHTML = iorad.getOembedIframe(tutorialParams.tutorialId, tutorialParams.tutorialTitle);
          // hack to put text place holder before/after iframe
          iframeHTML = "<p>&nbsp;</p><p>" + iframeHTML + "</p><p>&nbsp;</p>";

          var apiUrl = that.getFreshdeskApiUrl() + ARTICLE_API_URL.replace('{folder_id}', folderId);
          that.$request.post(apiUrl, {
            headers: {
              'Authorization': 'Basic ' + btoa('{{iparam.freshdesk_apikey}}'),
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              "title": tutorialTitle,
              "description": iframeHTML,
              "status": isdraft ? 1 : 2,
              "type": 1 // permanent
            })
          }).done(function(data){
            var response = JSON.parse(data.response);
            var message = "<b>" + tutorialTitle + "</b> ";
            message += isdraft? "(draft) " : "";
            message += "published to <b>" + category.text() + "</b> ";
            message = message.trim() + "." + " To view the article, please click " + "<a href='" + ARTICLE_URL.replace('{id}', response.id) + "' target='_blank'>this link</a>.";

            $pageBody.removeClass("iorad-open iorad-loading");
            domHelper.showModal(createEvent, "Success creating tutorial", message, "Ok", that.doNothingCallback.bind(that));

            var solution = '<p>Please check our solution: https://' + domHelper.getDomainName() + ARTICLE_URL.replace('{id}', response.id) + '</p><br><br>';
            if (addToTicket === 'reply') {
              if ($pageBody.find("#HelpdeskReply .redactor_editor").length == 0) {
                domHelper.ticket.openReply(solution);
              } else {
                $pageBody.find("#HelpdeskReply .redactor_editor").append(solution);
              }
            } else if (addToTicket === 'note') {
              if ($pageBody.find("#HelpdeskNotes .redactor_editor").length == 0) {
                domHelper.ticket.openNote(solution);
              } else {
                $pageBody.find("#HelpdeskNotes .redactor_editor").append(solution);
              }
            }
          }).fail(function(err){
            $pageBody.removeClass("iorad-open iorad-loading");
            var message = err.status === 401 ? 'Invalid API key in freshdesk app param.' : err.response;
            domHelper.showModal(createEvent, "Error while creating tutorial", message, "Ok", that.doNothingCallback.bind(that));
          });
        });
      });
    }
  };
})();