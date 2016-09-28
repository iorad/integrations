(function () {
  return {
    initialize: function () {
      if (page_type === "ticket") {
        debugger;
        CustomWidget.include_js('//iorad.com/server/assets/js/iorad.js');
        this.ioradLoaded(this.initApp);
      }
    },

    initApp: function () {
      iorad = window.iorad || {};    
      var $insertIoradButton = jQuery('.btn-iorad-widget');
      
      iorad.init({ env: "live", pluginType: "iorad_freshdesk_app_ticketing" }, function () {
			var t = 0, $bodyHTML = jQuery("body");
			
			// register events
			$insertIoradButton.click(function () {
				$bodyHTML.addClass("iorad-loading");
				iorad.createTutorial();
				t = setTimeout(function () {
					$bodyHTML.removeClass("iorad-loading");
				}, 5000);
				
				jQuery('#iorad-editor').off().load(function () {
					$bodyHTML.addClass("iorad-open");
					clearTimeout(t);
				})
			});
			
			iorad.on("editor:close", function (tutorialParams) {
				$bodyHTML.removeClass("iorad-open iorad-loading");
				clearTimeout(t);
				var iframeHTML = iorad.getEmbeddedPlayerUrl(tutorialParams.uid,
                                     tutorialParams.tutorialId, tutorialParams.tutorialTitle);
        domHelper.ticket.openReply("<p>" + iframeHTML + "</p>");
			});
		});
    },

    ioradLoaded: function (callback) {
      var interval = 10;
      var tryLoad = function () {
        if (window.iorad) {
          callback();
        } else {
          window.setTimeout(tryLoad, interval);
        }
      };

      window.setTimeout(tryLoad, interval);
    }
  }
})();
