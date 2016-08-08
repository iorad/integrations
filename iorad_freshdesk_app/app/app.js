(function () {
  return {
    initialize: function () {
      if (page_type === "ticket") {
        CustomWidget.include_js("//iorad.com/server/assets/js/iorad.js");
        this.ioradLoaded(this.initApp);
      }
    },

    initApp: function () {
      iorad = window.iorad || {};

      var $insertButtonsList = jQuery(jQuery(".redactor_insert_btns ul")[0]);
      var ioradButtonTemplate = "<li class=\"redactor_separator\"></li><li><a href=\"#\" class=\"insert_iorad tooltip\" data-editor-id=\"cnt-reply-body\" rel=\"ticket_iorad\" data-original-title=\"Insert Iorad Screen Capture\">Iorad</a></li>";
      var ioradButtonStyle = "<style>.insert_iorad { background-image: url(\"//test.iorad.com/server/assets/img/icon_iorad_freshdesk.png\") !important; background-size: 100%;}</style>";
      $insertButtonsList.append(ioradButtonTemplate);
      $insertButtonsList.append(ioradButtonStyle);
      $insertIoradButton = jQuery(".insert_iorad");
      
      iorad.init({ env: "live", pluginType: "iorad_freshdesk_app_ticketing" }, function () {
			var t = 0, $bodyHTML = jQuery("body");
			
			// register events
			$insertIoradButton.click(function () {
				$bodyHTML.addClass("iorad-loading");
				iorad.createTutorial();
				t = setTimeout(function () {
					$bodyHTML.removeClass("iorad-loading");
				}, 5000);
				
				jQuery("#iorad-editor").off().load(function () {
					$bodyHTML.addClass("iorad-open");
					clearTimeout(t);
				})
			});
			
			iorad.on("editor:close", function (tutorialParams) {
				$bodyHTML.removeClass("iorad-open iorad-loading");
				clearTimeout(t);
				var iframeHTML = iorad.getEmbeddedPlayerUrl(tutorialParams.uid,
                                     tutorialParams.tutorialId, tutorialParams.tutorialTitle);
				var $editorMessageBody = jQuery(".redactor_editor div");
				$editorMessageBody.append("<p>" + iframeHTML + "</p>");
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

/*
{%comment%}

## Help: Using iparam (​installation parameters) in code

iparam: The ​settings that you want your users to configure when installing the
app.

iparam definition is made in config/iparam_en.yml file. To use the defined
iparam in code, use Liquid notation like:

- {{iparam.username}}
- {{iparam.country}}

{%endcomment%}
*/
