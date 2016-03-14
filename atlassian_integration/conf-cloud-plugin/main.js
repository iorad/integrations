    var iframeUrl;
    var tutorID;
    var tutorialTitle;
    var tutorUID;
    var showSave;

    function closeDialog(outer_dialog) {
        if (outer_dialog != undefined) {
            outer_dialog.close();
        }
    }

    function saveMacro(close) {

        var macroParams = {
            iframeUrl: iframeUrl,
            tutorID: tutorID,
            tutorialTitle: tutorialTitle,
            tutorUID: tutorUID
        };

        outer_confluence.saveMacro(macroParams);

        if (close) {
            outer_confluence.closeMacroEditor();
            closeDialog(outer_dialog);
        }

        return true;
    }

    $(document).ready(function() {

        $("#cancelCapture, #cancelSolution, #cancelEditing").click(function() {
            closeDialog(outer_dialog);
        });

        $("#saveEditing").click(function() {
            saveMacro(true);
        });

        $("#insertSolution").click(function() {
            saveMacro(true);
            showSave = true;
        });

        $("#saveUrl").click(function() {
            var url = $(".urlInput").val();
            var params = getParamsFromUrl(url);
            if (params) {
                serializeTutorial(params);
                saveMacro(false);
                $("#previewContainer").html(iframeUrl);
            }
        });

        $("#startCapturing").click(function() {

            var options = {};
            options.pluginType = "confluence_cloud";
            iorad.init(options, function() {

                iorad.createTutorial();

                iorad.on('editor:close', function(tutorialParams) {

                    serializeTutorial(tutorialParams);
                    $("#create-solution").hide();
                    $("#insert-solution").show();
                    $("#solutionPreviewContainer").html(iframeUrl);
                });
            });
        });


        $("#editSolution, #editEditing").click(function() {

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

                    $(".urlContainer").hide();

                    if(showSave) {
                        $("#insert-solution").hide();
                        $("#edit-solution").show();
                        $("#previewContainer").html(iframeUrl);
                        $("#saveEditing").show();
                        $("#cancelEditing").hide();
                    } else {
                        $("#edit-solution").hide();
                        $("#insert-solution").show();
                        $("#solutionPreviewContainer").html(iframeUrl);
                    }
                });
            });
        });
    });

    function getFrameUrl() {
        var url = $("#previewContainer iframe").attr('src');
        var href = window.location.href
        var arr = href.split("//");

        var result = arr[0] + url;

        return result;
    }

    function getParamsFromUrl(frameUrl) {
        var searchKey = "iorad.com/";
        var n = frameUrl.indexOf(searchKey);
        if (n == -1) {
            return false;
        }
        var paramsString = frameUrl.substring(n + searchKey.length);
        var pathArray = paramsString.split( '/' );
        if (pathArray.length != 3) {
            return false;
        }

        var tutorialParams = {
            tutorialId: pathArray[1],
            tutorialTitle: pathArray[2],
            uid: pathArray[0]
        };

        return tutorialParams;
    }

    function serializeTutorial(tutorialParams) {
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
