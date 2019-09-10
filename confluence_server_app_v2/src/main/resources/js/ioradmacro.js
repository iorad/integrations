AJS.bind("init.rte", function() {


    // var macroName = 'CaptureSolution';

    // 1. create dialog to add macro
    //var dialog = new AJS.Dialog(400, 320);

    var dialogNew = new AJS.Dialog(400, 400);


    dialogNew.addPage();

    dialogNew.addCancel("Cancel", function() {
        dialogNew.hide();
    });


    // adds header for second page
    // dialogNew.addHeader("Iorad Tutorials");
    dialogNew.addPanel("SinglePanel", "<div id=\"ioRadnewDiv\" ><img/><h2>Instant step-by-step knowledge base solutions articles<\/h2><a class=\"btnIorad\" >Capture New Solution<\/a><a href=\"https://iorad.com/confluence\" >Need Help?<\/a><\/div>", "singlePanel");

    var dialogEdit = new AJS.Dialog(400, 400);

    dialogEdit.addPage();

    dialogEdit.addCancel("Cancel", function() {
        dialogEdit.hide();
    });


    // adds header for second page
    // dialogEdit.addHeader("Iorad Tutorials");
    dialogEdit.addPanel("SinglePanel", "<div id=\"ioRadEditDiv\" ><img/><h2>Edit your solution in the iorad editor.<\/h2><h2>When done click finish to save.<\/h2><a class=\"btnIoradEdit\" >Edit Solution<\/a><a href=\"https://iorad.com/confluence\" >Need Help?<\/a><\/div>", "singlePanel");




    $(".btnIoradEdit").bind("click", function() {

        var selection = AJS.Rte.getEditor().selection.getNode();
        var node = selection.attributes["data-macro-parameters"];

        var macroParams = node.nodeValue;

        var tutorParams = {
            uid: getValueFromString(macroParams, "uid"),
            tutorialId: getValueFromString(macroParams, "tutorId"),
            tutorialTitle: getValueFromString(macroParams, "tutorTitle"),
            labelContent: getValueFromString(macroParams, "labelContent")
        };


        ioradInit(tutorParams);

    });



    $(".btnIorad").bind("click", function() {


        ioradInit();


    });


    function ioradInit(tutorialParam) {

        var options = {};
        options.pluginType = "confluence";
        iorad.init(options, function() {


            if (tutorialParam) {

                iorad.editTutorial(tutorialParam);
            } else {
                iorad.createTutorial();
            }


            iorad.on('editor:close', function(tutorialParams) {

                var iframeHTML = iorad.getEmbeddedPlayerUrl(tutorialParams.uid,
                    tutorialParams.tutorialId, tutorialParams.tutorialTitle);


                // get current selection in editor

                var selection = AJS.Rte.getEditor().selection.getNode();

                var lables = "";
                var steeps = tutorialParams.steps;

                steeps.forEach(function(steep) {
                    lables += " " + steep.description;

                });



                var macro = {
                    name: macroName,
                    params: {
                        uid: tutorialParams.uid,
                        tutorId: tutorialParams.tutorialId,
                        tutorTitle: tutorialParams.tutorialTitle,
                        iframeSrc: getAttrsFromIframe(iframeHTML, "src") + "&plugin_type=confluence",
                        iframeHeight: getAttrsFromIframe(iframeHTML, "height"),
                        iframeWidth: getAttrsFromIframe(iframeHTML, "width"),
                        labelContent: lables
                    }
                };




                var macroRenderRequest = {
                    contentId: Confluence.Editor.getContentId(),
                    macro: {
                        name: macroName,
                        params: {
                            uid: tutorialParams.uid,
                            tutorId: tutorialParams.tutorialId,
                            tutorTitle: tutorialParams.tutorialTitle,
                            iframeSrc: getAttrsFromIframe(iframeHTML, "src") + "&plugin_type=confluence",
                            iframeHeight: getAttrsFromIframe(iframeHTML, "height"),
                            iframeWidth: getAttrsFromIframe(iframeHTML, "width"),
                            labelContent: lables
                        }
                    }
                };



                // convert macro and insert in DOM
                //   tinymce.plugins.Autoconvert.convertMacroToDom(macro, function(data, textStatus, jqXHR) {

                //         AJS.$(selection).html(data + "<p><br/></p>");
                //     }, function(jqXHR, textStatus, errorThrown) {
                //          AJS.log("error converting macro to DOM");
                //      });


                tinymce.confluence.MacroUtils.insertMacro(macroRenderRequest);
                dialogEdit.hide();
                dialogNew.hide();


            });

        });

    }




    // 5. bind event to open macro browser
    AJS.MacroBrowser.setMacroJsOverride(macroName, {
        opener: function(macro) {
            // open custom dialog
            //;
            var selection = AJS.Rte.getEditor().selection.getNode();
            var node = selection.attributes["data-macro-parameters"];
            if (node && node.nodeValue != "") {
                dialogEdit.show();

            } else {
                dialogNew.show();
            }

        }
    });


});


function getValueFromString(strsource, strSeek) {

    pattern = "|" + strSeek + "=";
    indexOfSeek = strsource.indexOf(pattern);
    strsource = strsource.substring(indexOfSeek + pattern.length);
    indexOfStolb = strsource.indexOf("|");
    return indexOfStolb == -1 ? strsource : strsource.substring(0, indexOfStolb);


}


function getAttrsFromIframe(iframeStr, strSeek) {
    pattern = strSeek + "=\"";
    indexOfSeek = iframeStr.indexOf(pattern);
    iframeStr = iframeStr.substring(indexOfSeek + pattern.length);
    indexOfStolb = iframeStr.indexOf("\"");
    return iframeStr.substring(0, indexOfStolb);
}
