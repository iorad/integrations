(function () {
  "use strict";

  return {
    initialize: function () {
      if (page_type === "ticket") {
        CustomWidget.include_js("//iorad.com/server/assets/js/iorad.js");
        appPlaceholder.ticket.belowRequestorInfo(jQuery(this.$container));
        this.ioradLoaded();
      }
    },

    initApp: function () {
      var $container = this.$container;
      var $pageBody = jQuery($container).closest("body");
      var $ioradButton = jQuery($container).find(".insert_iorad");
      var openReplayArea = function () {
        if ($pageBody.find(".redactor_editor div").length == 0) {
          $pageBody.find('#FwdButton').first().click();
        }
      };

      var iorad = window.iorad || {};

      $ioradButton.on('click', function () {
        openReplayArea();
      });

      iorad.init({env: "live", pluginType: "iorad_freshdesk_app_ticketing"}, function () {
        // register events
        $ioradButton.on('click', function () {

          $pageBody.addClass("iorad-loading");
          iorad.createTutorial();

          jQuery("#iorad-editor").off().load(function () {
            $pageBody.removeClass("iorad-loading").addClass("iorad-open");
          });
        });

        iorad.on("editor:close", function (tutorialParams) {
          $pageBody.removeClass("iorad-open").addClass("iorad-loading");
          var iframeHTML = iorad.getEmbeddedPlayerUrl(tutorialParams.uid, tutorialParams.tutorialId, tutorialParams.tutorialTitle);
          $pageBody.find(".redactor_editor div").append("<p>" + iframeHTML + "</p>");
          window.setTimeout(function () {
            $pageBody.removeClass("iorad-loading");
          }, 1000);
        });
      });
    },

    ioradLoaded: function () {
      var that = this;
      var interval = 10;
      var tryLoad = function () {
        if (window.iorad) {
          that.initApp();
        } else {
          window.setTimeout(tryLoad, interval);
        }
      };

      window.setTimeout(tryLoad, interval);
    }
  };
})();