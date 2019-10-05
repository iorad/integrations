AJS.toInit(function(){
    var $body = AJS.$('body');
    var resourceURL = AJS.Data.get('editor-plugin-resource-prefix');
    var pluginKey = "com.iorad.confluence.iorad_for_confluence_server";
    var webResourceKey = "main-web-resources";
    var templateURL = resourceURL + '/download/resources/' + pluginKey + ':' + webResourceKey + '/templates/iorad_for_confluence_server.html';
    var iconURL = resourceURL + '/download/resources/' + pluginKey + ':' + webResourceKey + '/images/icon.png';

    AJS.$.get(templateURL, function (data) {
        $body.append(data);
        $body.find('#iorad-logo-image').prop('src', iconURL).load();
    });


    AJS.bind("init.rte", function () {
        var intervalId = window.setInterval(function() {
            var macroname = 'embed-iorad';
            var $ioradTutorialLink = AJS.$("#iorad-link-text-box");
            var $ioradTutorialEmbedCode = AJS.$("#iorad-embed-code-textarea");
            var $errorLink = AJS.$(".iorad-error-link");
            var $submitButton = AJS.$("#iorad-submit-button");
            var $switchButton = AJS.$('#iorad-switch-button');

            if (AJS.$('#iorad-container').length > 0) {
                window.clearInterval(intervalId);

                var $dialog = AJS.dialog2('#embed-iorad-container');

                AJS.MacroBrowser.setMacroJsOverride(macroname, {
                    opener: function(macro) {
                        $ioradTutorialLink.closest('.field-group').removeClass('hidden');
                        $ioradTutorialEmbedCode.closest('.field-group').addClass('hidden');
                        $switchButton.text('Switch to step list');
                        clearForm();

                        var selection = AJS.Rte.getEditor().selection.getNode();
                        var node = selection.attributes["data-macro-parameters"];
                        if (node && node.nodeValue !== "") {
                            var macroParams = node.nodeValue;

                            var tutorialLink = getValueFromString(macroParams, "iframeSrc");
                            var embedCode = getValueFromString(macroParams, "embedCode");

                            if (tutorialLink && tutorialLink.trim() !== '') {
                                getAndPutIoradLinkUrl(tutorialLink);
                            } else if (embedCode && embedCode.trim() !== '') {
                                getAndPutIoradEmbedCode(embedCode);
                            }
                        }

                        $dialog.show();
                    }
                });

                function parseQueryString(queryString) {
                    var queryArr = queryString.replace('?','').split('&');
                    var params = [];

                    for (var i = 0; i < queryArr.length; i++) {
                        var keyVal = queryArr[i].split('=');
                        if (keyVal.length === 2){
                            params[keyVal[0]] = keyVal[1];
                        }
                    }

                    return params;
                }

                function saveMacro(link) {
                    var parser = document.createElement('a');
                    parser.href = link.replace('&plugin_type\\=confluence', '');

                    if (['www.iorad.com', 'iorad.com', 'test.iorad.com', 'ior.ad'].indexOf(parser.hostname) === -1) {
                        return;
                    }

                    var queries = parseQueryString(parser.search);
                    queries['plugin_type'] = 'confluence';
                    queries['oembed'] = '1';

                    parser.search = '?' + queries.join('&');

                    var macroRenderRequest = {
                        contentId: Confluence.Editor.getContentId(),
                        macro: {
                            name: macroname,
                            params: {
                                iframeSrc: parser.href,
                                embedCode: ''
                            }
                        }
                    };

                    tinymce.confluence.MacroUtils.insertMacro(macroRenderRequest);
                    $dialog.hide();
                }

                function saveEmbedToMacro(embedCode) {
                    var macroRenderRequest = {
                        contentId: Confluence.Editor.getContentId(),
                        macro: {
                            name: macroname,
                            params: {
                                iframeSrc: '',
                                embedCode: LZString.compressToEncodedURIComponent(embedCode)
                            }
                        }
                    };

                    tinymce.confluence.MacroUtils.insertMacro(macroRenderRequest);
                    $dialog.hide();
                }

                function getValueFromString(strsource, strSeek) {
                    pattern = "|" + strSeek + "=";
                    indexOfSeek = strsource.indexOf(pattern);
                    strsource = strsource.substring(indexOfSeek + pattern.length);
                    indexOfStolb = strsource.indexOf("|");
                    return indexOfStolb === -1 ? strsource : strsource.substring(0, indexOfStolb);
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

                AJS.$('body').on('change, keyup', '#' + $ioradTutorialLink.attr('id') + ', #' + $ioradTutorialEmbedCode.attr('id'), function () {
                    clearForm();
                });

                AJS.$('#iorad-cancel-button').on('click', function () {
                    $dialog.hide();
                });

                AJS.$('#iorad-form').on('submit', function (e) {
                    e.preventDefault();

                    if ($ioradTutorialLink.val().trim() !== '') {
                        saveMacro($ioradTutorialLink.val());
                    } else if ($ioradTutorialEmbedCode.val().trim() !== '') {
                        var embedCode = AJS.$('<div />').html($ioradTutorialEmbedCode.val()).html();
                        if (embedCode.indexOf('iorad.com/player/') > -1) {
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
            }
        }, 500);
    });
});
