/*
This is the first JavaScript file that runs once your iframe is loaded within a Zendesk product.
*/
import ZAFClient from 'zendesk_app_framework_sdk';
import I18n from 'i18n';
import LegacyApp from './legacy_app';
import iorad from "./lib/iorad";

// Create a new ZAFClient
const client = ZAFClient.init();
let legacyApp = null;

// add an event listener to detect once your app is registered with the framework
client.on('app.registered', function (appData) {
    client.get('currentUser.locale').then(userData => {
        // load translations based on the account's current locale
        I18n.loadTranslations(userData['currentUser.locale']);
        // create a new instance of your app
        legacyApp = new LegacyApp(client, appData);
    });
});

window.addEventListener("message", function receiveMessage(event) {
    if (event.origin !== iorad.getBaseUrl()) {
        return;
    }

    const data = event.data;
    if (data && data.type === 'api' && data.command === 'editor:close') {

        const client = ZAFClient.init();
        client.get('instances').then(function (instancesData) {

            for (const instanceGuid in instancesData.instances) {
                const location = instancesData.instances[instanceGuid].location;
                if (location === 'nav_bar' || legacyApp.addToHelpCenter) {
                    legacyApp.createArticle(data.value);

                } else if (location === 'ticket_sidebar' || location === 'new_ticket_sidebar') {
                    legacyApp.addIoradPlayerUrlToNewTicketComment(data.value);
                }
            }
        });
    }

}, false);