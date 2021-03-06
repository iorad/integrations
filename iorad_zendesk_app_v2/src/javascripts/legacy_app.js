import BaseApp from "base_app";
import helpers from "helpers";
import Base64 from "base64";
import _ from "lodash";
import iorad from './lib/iorad';

window.helpers = helpers;
window.Base64 = Base64;

const App = {
    settings: {},
    categoriesList: [],
    lastSectionsList: [],
    timeout: 0,
    lastCategoryId: 0,
    lastSectionId: 0,
    myDefaultLocale: "",
    SOLUTION_APP_LOCATION: "nav_bar",
    TICKETING_APP_LOCATION_PATTERN: /ticket_sidebar$/,
    currentPluginType: "",
    addToHelpCenter: false,
    addToHelpCenterAsDraft: false,
    pluginTypes: {
        SOLUTION: "zendeskapp_solutions",
        // this is a nav bar app that creates tutorials.
        TICKETING: "zendeskapp_ticketing" // this is a ticket sidebar app that creates tutorials for existing and new tickets.
    },
    TICKET_COMMENT_FORMAT: '<p>This solution article should help: <a href="%@" target="_blank">%@</a></p>',
    events: {
        "app.activated": "init",
        "pane.activated": "runSolutionApp",
        "pane.deactivated": "onModalHidden",
        "fetchCategories.done": "onFetchCategories",
        "fetchSections.done": "onFetchSections",
        "createArticle.done": "onCreateArticle",
        "createArticle.fail": "onCreateArticleFailed",
        "fetchLocales.done": "onLocaleLoaded",
        "click .btn-iorad-widget": "submitNewTutorial",
        "click #addToHelpCenterToggle": "onAddToHelpCenterToggleClicked",
        "click #addToHelpCenterAsDraftToggle": "onAddToHelpCenterAsDraftToggleClicked",
        "change .categoryOptions": "updateSectionOptions",
        "editorClosed": "onIoradClose"
    },
    requests: require("./lib/requests.js"),

    init: function () {
        const that = this;
        that.zafClient.metadata().then(function (metadata) {
            that.settings = metadata.settings;
            that.addToHelpCenterAsDraft = that.settings.addToHelpCenterAsDraft;
            that.ajax("fetchLocales");

            that.runTicketingApp();
            that.runSolutionApp();
        });
    },
    // conditionally run app based on app current location
    runSolutionApp: function () {
        if (this.currentLocation() === this.SOLUTION_APP_LOCATION) {
            // load post to solutions app.
            this.currentPluginType = this.pluginTypes.SOLUTION;
            this.startFetchCategories();
        }
    },
    runTicketingApp: function () {
        if (this.TICKETING_APP_LOCATION_PATTERN.test(this.currentLocation())) {
            // load ticketing app.
            this.currentPluginType = this.pluginTypes.TICKETING;
            this.showTicketingView();
        }
    },
    startFetchCategories: function () {
        this.ajax("fetchCategories");
    },
    onLocaleLoaded: function (data) {
        this.myDefaultLocale = data.default_locale;
    },
    onModalHidden: function () {
        if (this.currentPluginType === this.pluginTypes.SOLUTION) {
            this.initializeSolutionAppControl();
        } else {
            this.showTicketingView();
        }
    },
    onIoradClose: function (data) {
        console.log('onIoradClose, data = ', data);
        if (data && data.steps && data.steps.length > 0) {
            var that = this;
            that.ajax("getIoradURL", data.tutorialId).done(function (urls) {
                if (that.currentPluginType === that.pluginTypes.SOLUTION || that.addToHelpCenter) {
                    that.createArticle(urls);
                } else if (that.currentPluginType === that.pluginTypes.TICKETING) {
                    that.addIoradPlayerUrlToNewTicketComment(urls);
                }
            }).fail(function () {
                that.showModal(that.renderTemplate('errorModal'));
            });
        }
    },

    onFetchCategories: function (data) {
        this.categoriesList = data.categories;

        _.each(this.categoriesList, function (category) {
            category.selected = false;
        });

        this.categoriesList[0].selected = true;

        if (this.currentPluginType === this.pluginTypes.SOLUTION) {
            this.initializeSolutionAppControl();
        } else {
            this.initializeTicketingAppControl();
        }
    },
    onFetchSections: function (data) {
        this.lastSectionsList = data.sections;

        if (this.currentPluginType === this.pluginTypes.SOLUTION) {
            this.switchTo("ioradWidgetControl", {
                categories: this.categoriesList,
                sections: this.lastSectionsList,
                settings: this.settings
            });
        } else {
            this.showTicketingView();
        }
    },
    onCreateArticle: function (data) {
        if (this.addToHelpCenter && this.currentPluginType === this.pluginTypes.TICKETING) {
            this.addSolutionUrlToNewTicketComment({
                title: data.article.title,
                url: data.article.html_url
            });
        } else {
            this.showModal(this.renderTemplate("tutorialCreatedModal", {
                msg: data.article.title,
                url: data.article.html_url
            }));
        }
    },
    onCreateArticleFailed: function () {
        this.showModal(this.renderTemplate('errorModal'));
    },
    onAddToHelpCenterToggleClicked: function (event) {
        this.addToHelpCenter = event.target.checked;

        if (this.addToHelpCenter) {
            this.$(".loading").removeClass("hide");
            this.startFetchCategories();
        } else {
            this.showTicketingView();
        }
    },
    onAddToHelpCenterAsDraftToggleClicked: function (event) {
        this.addToHelpCenterAsDraft = event.target.checked;
    },

    submitNewTutorial: function (event) {
        event.preventDefault();

        this.lastCategoryId = parseInt(this.$(".categoryOptions").val(), 10);
        this.lastSectionId = parseInt(this.$(".sectionOptions").val(), 10);

        if (this.currentPluginType === this.pluginTypes.SOLUTION
            && (isNaN(this.lastCategoryId) || isNaN(this.lastSectionId))) {
            this.showModal(this.I18n.t("modalTemplate.validationError"));
            return;
        }

        if (this.addToHelpCenter && (isNaN(this.lastCategoryId) || isNaN(this.lastSectionId))) {
            this.showModal(this.I18n.t("modalTemplate.validationError"));
            return;
        }

        const iframeSrc = iorad.newTutorialEditorUrl(this.currentPluginType);

        const that = this;
        that.zafClient.invoke('instances.create', {
            location: 'modal',
            url: iframeSrc,
        }).then(function(modalContext) {
            const modalClient = that.zafClient.instance(modalContext['instances.create'][0].instanceGuid);
            modalClient.on('editorReady', function (tutorialParam) {
                that.tutorialParam = tutorialParam;
            });

            modalClient.on('modal.close', function() {
                if (that.tutorialParam && modalClient._parent && modalClient._parent._instanceGuid) {
                    that.zafClient.instance(modalClient._parent._instanceGuid).trigger('editorClosed', _.clone(that.tutorialParam, true));
                    that.tutorialParam = null;
                }
            });

            modalClient.invoke('resize', { width: '80vw', height: '80vh' });
        });
    },

    updateSectionOptions: function (event) {
        event.preventDefault();

        const $selection = this.$(event.target);
        const selectedCategoryId = parseInt($selection.val(), 10);
        const selectedCategory = _.find(this.categoriesList, function (category) {
                return category.id === selectedCategoryId;
            });

        _.each(this.categoriesList, function (category) {
            category.selected = false;
        });

        selectedCategory.selected = true;
        this.ajax("fetchSections", selectedCategoryId);
    },
    initializeSolutionAppControl: function () {
        this.switchTo("ioradWidgetControl", {
            categories: this.categoriesList,
            settings: this.settings
        });
        const selectedCategoryId = parseInt(this.$(".categoryOptions").val(), 10);
        this.ajax("fetchSections", selectedCategoryId);
    },
    initializeTicketingAppControl: function () {
        this.ajax("fetchSections", this.categoriesList[0].id);
    },
    createArticle: function (urls) {
        const saveAsDraft = this.currentPluginType === this.pluginTypes.SOLUTION? this.addToHelpCenterAsDraft: false;
        const articleJson = JSON.stringify({
            article: {
                title: urls.title,
                locale: this.myDefaultLocale,
                body: urls.embedShareStatic ? urls.EMBED_STATIC : urls.EMBED,
                draft: saveAsDraft
            }
        }); // this could be replaced with a loading marque.

        this.$(".iorad-editor-wrapper").html();
        this.ajax("createArticle", this.lastSectionId, articleJson);
    },
    addIoradPlayerUrlToNewTicketComment: function (urls) {
        this.appendtextToZendeskComment(urls.title, urls.PUBLIC_LINK);
        this.showLinkCreatedModal(urls.PUBLIC_LINK);
    },
    addSolutionUrlToNewTicketComment: function (article) {
        this.appendtextToZendeskComment(article.title, article.url);
        this.showLinkCreatedModal(article.url);
    },

    appendtextToZendeskComment: function (text, link) {
        const that = this;
        that.zafClient.get('comment.useRichText').then(function (data) {
            if (data['comment.useRichText'] === true) {
                const html = helpers.fmt(that.TICKET_COMMENT_FORMAT, link, text);
                that.zafClient.invoke('comment.appendHtml', html);
            } else {
                that.zafClient.invoke('comment.appendText', `This solution article should help: ${link}`);
            }
        });
    },

    showLinkCreatedModal: function (articleUrl) {
        this.showModal(this.renderTemplate("linkCreatedModal", {
            addToHelpCenter: this.addToHelpCenter,
            url: articleUrl
        }));
    },
    showTicketingView: function () {
        if (this.addToHelpCenter) {
            this.switchTo("ticketingTemplate", {
                categories: this.categoriesList,
                sections: this.lastSectionsList,
                addToHelpCenter: this.addToHelpCenter
            });
        } else {
            this.switchTo("ticketingTemplate");
        }
    },
    showModal: function (template) {
        return this.zafClient.invoke('instances.create', {
            location: 'modal',
            url: 'assets/modal.html?data=' + Base64.encode(template),
        });
    },
};

export default BaseApp.extend(App);
