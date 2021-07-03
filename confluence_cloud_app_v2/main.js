var outer_confluence;
var outer_dialog;

var $ioradTutorialLink = $("#iorad-link-text-box");
var $ioradTutorialEmbedCode = $("#iorad-embed-code-textarea");
var $errorLink = $(".error-link");
var $formContainer = $("#iorad-form-container");
var $submitButton = $("#submit-button");
var $switchButton = $('#switch-button');

function closeDialog(outer_dialog) {
    if (outer_dialog) {
        outer_dialog.close();
    }
}

function parseQueryString(queryString) {
    var queryArr = queryString.replace('?', '').split('&');
    var params = [];

    for (var i = 0; i < queryArr.length; i++) {
        var keyVal = queryArr[i].split('=');
        if (keyVal.length === 2) {
            params[keyVal[0]] = keyVal[1];
        }
    }

    return params;
}

function saveMacro(iframeUrl) {
    var parser = document.createElement('a');
    parser.href = iframeUrl.replace('&plugin_type\\=confluence', '');

    if (
        [
            'www.iorad.com',
            'iorad.com',
            'test.iorad.com',
            'ior.ad'
        ].indexOf(parser.hostname) === -1
    ) {
        return;
    }

    var queries = parseQueryString(parser.search);
    queries['plugin_type'] = 'confluence';
    queries['oembed'] = '1';

    var queryString = "?";
    for (var key in queries) {
        queryString += key + "=" + queries[key] + "&";
    }
    parser.search = queryString;

    outer_confluence.saveMacro({
        iframeUrl: '', // keep for backward compatible
        playerUrl: parser.href,
        embedCode: ''
    });

    outer_confluence.closeMacroEditor();
    closeDialog(outer_dialog);
    return true;
}

function saveEmbedToMacro(embedCode) {
    outer_confluence.saveMacro({
        iframeUrl: '',
        playerUrl: '',
        embedCode: LZString.compressToEncodedURIComponent(embedCode)
    });

    outer_confluence.closeMacroEditor();
    closeDialog(outer_dialog);
    return true;
}

function getAndPutIoradLinkUrl(url) {
    if (url) {
        $ioradTutorialLink.val(url);
        clearForm();
    }
}

function getAndPutIoradEmbedCode(embedCode) {
    $switchButton.trigger('click');
    $ioradTutorialEmbedCode.val(LZString.decompressFromEncodedURIComponent(embedCode));
    clearForm();
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

function showError() {
    $ioradTutorialLink.addClass("border-red");
    $errorLink.removeClass('hidden');
}

function hideError() {
    $ioradTutorialLink.removeClass("border-red");
    $errorLink.addClass('hidden');
}

function clearForm() {
    hideError();
    if ($ioradTutorialLink.val().trim() === '' && $ioradTutorialEmbedCode.val().trim() === '') {
        $submitButton.removeClass('btn-black');
    } else {
        $submitButton.addClass('btn-black');
    }
}

$formContainer.on('change, keyup', '#' + $ioradTutorialLink.attr('id') + ', #' + $ioradTutorialEmbedCode.attr('id'), function () {
    clearForm();
});

$("#cancel-button").on('click', function () {
    closeDialog(outer_dialog);
});

$('#iorad-form').on('submit', function (e) {
    e.preventDefault();

    var tutorialLink = $ioradTutorialLink.val();
    if (tutorialLink && tutorialLink.trim() !== '') {
        saveMacro(tutorialLink);
    } else if ($ioradTutorialEmbedCode.val() !== '') {
        var embedCode = $('<div />').html($ioradTutorialEmbedCode.val()).html();
        if (embedCode.indexOf('iorad.com/player/') > -1) {
            var minify = require('html-minifier').minify;
            embedCode = minify(embedCode, {
                removeComments: true,
                collapseWhitespace: true
            });

            saveEmbedToMacro(embedCode);
        } else {
            showError();
        }
    } else {
        showError();
    }
});

$switchButton.on('click', function (e) {
    e.preventDefault();

    $ioradTutorialLink.val('');
    $ioradTutorialEmbedCode.val('');
    clearForm();

    if ($ioradTutorialLink.closest('.field-group').hasClass('hidden')) {
        $ioradTutorialLink.closest('.field-group').removeClass('hidden');
        $ioradTutorialEmbedCode.closest('.field-group').addClass('hidden');
        $switchButton.text('Switch to step list');
    } else {
        $ioradTutorialLink.closest('.field-group').addClass('hidden');
        $ioradTutorialEmbedCode.closest('.field-group').removeClass('hidden');
        $switchButton.text('Switch to player only');
    }
});
