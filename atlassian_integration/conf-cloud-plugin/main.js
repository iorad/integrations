    var iframeUrl;
    var tutorID;
    var tutorialTitle;
    var tutorUID;

    function closeDialog(outer_dialog) {
        if (outer_dialog != undefined) {
            outer_dialog.close();
        }
    }

    $(document).ready(function() {



        //        iorad.on('editor:create', function() {
        //            //console.log('create a new tutorial now...');
        //            alert(newTutorialEditorUrl());
        //            window.location = newTutorialEditorUrl();
        //
        //        });





        $("#cancelCapture").click(function() {
            closeDialog(outer_dialog);
        });


        $("#insertSolution").click(function() {
            var macroParams = {
                iframeUrl: iframeUrl,
                tutorID: tutorID,
                tutorialTitle: tutorialTitle,
                tutorUID: tutorUID
            };
            outer_confluence.saveMacro(macroParams);
            outer_confluence.closeMacroEditor();
            closeDialog(outer_dialog);
            return true;
        });

        $("#startCapturing").click(function() {

            var options = {};
            options.pluginType = "confluence_cloud";
            iorad.init(options, function() {

                iorad.createTutorial();

                iorad.on('editor:close', function(tutorialParams) {
                    //debugger;


                    serializeTutorial(tutorialParams);
                    $("#previewContainer").html(iframeUrl);
                    $("#startCapturing").hide();
                    $("#editSolution").show();
                    $("#insertSolution").show();
                    $("#congratsCaptured").show();

                });
            });


        });


        $("#editSolution").click(function() {

            var options = {};
            options.pluginType = "confluence_cloud";
            iorad.init(options, function() {

                var tutorialParam = {

                    tutorialId: tutorID,
                    tutorialTitle: tutorialTitle,
                    uid: tutorUID
                };

                iorad.editTutorial(tutorialParam);

                iorad.on('editor:close', function(tutorialParams) {

                    serializeTutorial(tutorialParams);
                    $("#previewContainer").html(iframeUrl);
                    $("#startCapturing").hide();
                    $("#editSolution").show();
                    if (!$("#insertSolution").is(":visible")) {
                        $("#saveSolution").show();
                    }
                    $("#congratsCaptured").show();

                });
            });


        });
    });



    function serializeTutorial(tutorialParams) {


        debugger;
        iframeUrl = iorad.getEmbeddedPlayerUrl(tutorialParams.uid,
            tutorialParams.tutorialId, tutorialParams.tutorialTitle);

        tutorID = tutorialParams.tutorialId;
        tutorialTitle = tutorialParams.tutorialTitle;
        tutorUID = tutorialParams.uid;
    }


    function getAttrsFromIframe(iframeStr, strSeek) {
        pattern = strSeek + "=\"";
        indexOfSeek = iframeStr.indexOf(pattern);
        iframeStr = iframeStr.substring(indexOfSeek + pattern.length);
        indexOfStolb = iframeStr.indexOf("\"");
        return iframeStr.substring(0, indexOfStolb);
    }

    function getUrlParameter(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
