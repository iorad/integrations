var iframeUrl;
var tutorID;
var tutorialTitle;
var outer_confluence;
var outer_dialog;

var $ioradTutorialLink = $("#iorad-link-text-box");
var $errorLink = $(".error-link");
var $previewContainer = $("#preview-container");
var $previewContainerContent = $("#preview-container-content");
var $formContainer = $("#form-container");

function closeDialog(outer_dialog) {
    if (outer_dialog) {
        outer_dialog.close();
    }
}

function saveMacro(close) {
    var macroParams = {
        iframeUrl: iframeUrl,
        tutorID: tutorID,
        tutorialTitle: tutorialTitle
    };
    outer_confluence.saveMacro(macroParams);

    if (close) {
        outer_confluence.closeMacroEditor();
        closeDialog(outer_dialog);
    }

    return true;
}

function getFrameUrl() {
    if (iframeUrl) {
        var href = window.location.href;
        var arr = href.split("//");

        $previewContainerContent.html(iframeUrl);
        var url = $previewContainerContent.find("iframe").attr('src');
        console.log(url,  (url && (url.indexOf('https://') > -1 || url.indexOf('http://') > -1)));
        if (url && (url.indexOf('https://') > -1 || url.indexOf('http://') > -1)) {
            return arr[0] + "//" + url.split("//")[1];
        } else {
            return arr[0] + url;
        }
    }

    return false;
}

function getAndPutIoradLinkUrl() {
    var url = getFrameUrl();
    if (url) {
        $ioradTutorialLink.val(url);
    }
}

function getParamsFromUrl(frameUrl) {
    var searchKey = "iorad.com/";
    var n = frameUrl.indexOf(searchKey);
    if (n === -1) {
        return false;
    }

    var paramsString = frameUrl.substring(n + searchKey.length);
    var pathArray = paramsString.split('/');
    if (pathArray.length !== 3) {
        return false;
    }

    return {
        tutorialId: pathArray[1],
        tutorialTitle: pathArray[2]
    };
}

function serializeTutorial(tutorialParams) {
    iframeUrl = iorad.getOembedIframe(tutorialParams.tutorialId, tutorialParams.tutorialTitle);
    tutorID = tutorialParams.tutorialId;
    tutorialTitle = tutorialParams.tutorialTitle;
}

function getAttrsFromIframe(iframeStr, strSeek) {
    var pattern = strSeek + "=\"";
    var indexOfSeek = iframeStr.indexOf(pattern);
    iframeStr = iframeStr.substring(indexOfSeek + pattern.length);
    var indexOfStolb = iframeStr.indexOf("\"");
    return iframeStr.substring(0, indexOfStolb);
}

function getUrlParameter(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

$ioradTutorialLink.on('change', function () {
    $ioradTutorialLink.removeClass("border-red");
    $errorLink.hide();
});

$("#cancel-button").on('click', function () {
    closeDialog(outer_dialog);
});

$("#preview-button").on('click', function () {
    var params = getParamsFromUrl($ioradTutorialLink.val());
    if (params) {
        serializeTutorial(params);

        $previewContainerContent.html(iframeUrl);
        $previewContainer.removeClass('hidden');
        $formContainer.addClass('hidden');
    } else {
        $ioradTutorialLink.addClass("border-red");
        $errorLink.show();
    }
});

$(".dialog-close-button").on('click', function(e) {
    e.preventDefault();
    $previewContainer.addClass('hidden');
    $formContainer.removeClass('hidden');
});

$('#iorad-form').on('submit', function (e) {
    e.preventDefault();

    var params = getParamsFromUrl($ioradTutorialLink.val());
    if (params) {
        serializeTutorial(params);
        saveMacro(true);
    } else {
        $ioradTutorialLink.addClass("border-red");
        $errorLink.show();
    }
});
