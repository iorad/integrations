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
    TICKET_COMMENT_FORMAT: '<p><a href="%@" target="_blank">%@</a></p>',
    events: {
        "app.activated": "init",
        "pane.activated": "runSolutionApp",
        "fetchCategories.done": "onFetchCategories",
        "fetchSections.done": "onFetchSections",
        "createArticle.done": "onCreateArticle",
        "createArticle.fail": "onCreateArticleFailed",
        "fetchLocales.done": "onLocaleLoaded",
        "click .btn-iorad-widget": "submitNewTutorial",
        "click #addToHelpCenterToggle": "onAddToHelpCenterToggleClicked",
        "click #addToHelpCenterAsDraftToggle": "onAddToHelpCenterAsDraftToggleClicked",
        "change .categoryOptions": "updateSectionOptions",
        "iframe.editor.close": "onIoradClose"
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
        if (
            this.currentPluginType === this.pluginTypes.SOLUTION ||
            this.addToHelpCenter
        ) {
            this.createArticle(data);
        } else if (this.currentPluginType === this.pluginTypes.TICKETING) {
            this.addIoradPlayerUrlToNewTicketComment(data);
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
            this.switchTo("tutorialCreatedModal", {
                msg: data.article.title,
                url: data.article.html_url
            });
            // todo fix modal
            this.$("#mySuccessModal").modal({
                backdrop: true,
                keyboard: false
            });
        }
    },
    onCreateArticleFailed: function () {
        const that = this;
        const template = that.renderTemplate('errorModal');
        that.zafClient.invoke('instances.create', {
            location: 'modal',
            url: 'assets/modal.html?data=' + Base64.encode(template),
        }).then(function(modalContext) {
            const modalClient = that.zafClient.instance(modalContext['instances.create'][0].instanceGuid);
            modalClient.on('modal.close', function() {
                that.onModalHidden();
            });
        });
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
        this.switchTo("ioradWidgetTutorialBuilder");
        this.$(".iorad-editor-wrapper iframe").addClass("iorad-editor");

        const zendeskAppsParams = $ioradEditorIframe.attr("src").replace("?", "&");
        $ioradEditorIframe.attr("src", iorad.newTutorialEditorUrl(this.currentPluginType) + zendeskAppsParams);
    },
    updateSectionOptions: function (event) {
        event.preventDefault();

        const $selection = this.$(event.originalEvent.srcElement),
            selectedCategoryId = parseInt($selection.val(), 10),
            selectedCategory = _.find(this.categoriesList, function (category) {
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
    createArticle: function (data) {
        const iframeHTML = iorad.getEmbeddedPlayerUrl(data.uid, data.tutorialId, data.tutorialTitle);
        let articleBody = helpers.fmt("<p>%@</p>", iframeHTML);
        const saveAsDraft = this.currentPluginType === this.pluginTypes.SOLUTION? this.addToHelpCenterAsDraft: false;

        _.each(data.steps, function (step) {
            articleBody += helpers.fmt("<p style='display: none;'>%@</p>", helpers.safeString(step.description).string);
        });

        const articleJson = JSON.stringify({
            article: {
                title: data.tutorialTitle,
                locale: this.myDefaultLocale,
                body: articleBody,
                draft: saveAsDraft
            }
        }); // this could be replaced with a loading marque.

        this.$(".iorad-editor-wrapper").html();
        this.ajax("createArticle", this.lastSectionId, articleJson);
    },
    addIoradPlayerUrlToNewTicketComment: function (data) {
        const url = iorad.getPlayerUrl(data.uid, data.tutorialId, data.tutorialTitle);
        const comment = helpers.fmt(this.TICKET_COMMENT_FORMAT, data.tutorialTitle, url);
        this.zafClient.invoke('comment.appendHtml', comment);
        this.showLinkCreatedModal(url);
    },
    addSolutionUrlToNewTicketComment: function (article) {
        const comment = helpers.fmt(this.TICKET_COMMENT_FORMAT, article.title, article.url);
        this.zafClient.invoke('comment.appendHtml', comment);
        this.showLinkCreatedModal(article.url);
    },
    showLinkCreatedModal: function (articleUrl) {
        this.switchTo("linkCreatedModal", {
            addToHelpCenter: this.addToHelpCenter,
            url: articleUrl
        });

        // todo fix modal
        this.$("#mylinkCreatedModal").modal({
            backdrop: true,
            keyboard: false
        });
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
    }
};

export default BaseApp.extend(App);
