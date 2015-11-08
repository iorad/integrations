# Integrations
This repository contains several examples showing you how you can embed Iorad tutorial builder right in the heart of your chosen online Knowledgebase system.

## Iorad Web Widget

Iorad Web Widget can be easily installed by help center admins. Agents can create iorad articles/tutorials using Iorad straight from their Web Portal home page.

Currently, Iorad Web Widget only supports Fresh desk.
In the future, we will replace the Zendesk Help Center Widget with Iorad Web Widget. We will also be looking at possibilities with desk.com.

### To Build and play with Iorad Web Widget source code:
* install NPM - Package manager for Node.js
* Install Grunt.js ```[sudo] npm install -g grunt-cli```
* Install Bower ```[sudo] npm install -g bower```
* Run ``` grunt install-bower-packages```
* Run ``` grunt build-dev-js```
* Run ``` grunt build-release-js``` Only run this if you really wants to read a uglified javascript file :) So don't...

After you have successfully followed through the steps above, you will find IoradWebWidget-*.js in scripts/vendor/dist.

### To Install:

#### Install Iorad Web Widget for Freshdesk Web Portal
* Go to Helpdesk rebranding page - https://{your_domain}.freshdesk.com/account/edit
* Click on **Customize Portal**
* Click on the **Layout & pages** tab
* Go to **Page layout** editor
* Copy and Paste the source code below at the **end of the Page Layout file**.

##### For Test:
```
{% if portal.user.is_agent %}
	<script type="text/javascript" src="https://test.iorad.com/server/assets/bower_components/integrations/IoradWebWidget/dist/IoradWebWidget-{widget name}.min-0.0.1.js"></script>
{% endif %}
```

##### For Live:
```
{% if portal.user.is_agent %}
	<script type="text/javascript" src="https://iorad.com/server/assets/bower_components/integrations/IoradWebWidget/dist/IoradWebWidget-{widget name}.min-0.0.1.js"></script>
{% endif %}
```

#### Install Iorad Web Widget for Uservoice Web Portal
coming soon.

## Iorad Ticketing FreshPlug

This is a Freshplug that list all available categories and folders. When clicking on a create tutorial button, the Iorad page shows up. Upon closing the tutorial page, it is automatically added to a new article page in a selected folder.

### To Install:
* Go to Admin page - https://{your_domain}.freshdesk.com/admin/home
* Click on **Integrations**
* Click on the **FreshPlugs** tab
* Click **New FreshPlug** to create.
* Enter details such as **Name** and **Description**, copy and paste Iorad FreshPlug [source code](https://github.com/iorad/integrations/blob/master/iorad_ticketing_freshplug/iorad_ticketing_freshplug/dist/ioradTicketingFreshplug.txt) into Script field.
* Check **Show the widget in ticket view page.** option and Click **Create and Enable** to complete the installation.
 
### To Build and play with Iorad Web Widget source code:
* install NPM - Package manager for Node.js
* Install Grunt.js ```[sudo] npm install -g grunt-cli```
* Install Bower ```[sudo] npm install -g bower```
* Run ``` grunt install-bower-packages```
* Run ``` grunt build-freshplug```

## Zendesk Help Center

To Install: (Assume Help Center is enabled.)
* Go to **General Settings** and enable **Display unsafe content**
* In Help Center, Click on **Customize Design**
* Click on **Edit Theme** to go to Help Center's Theme Editor.
* Click on the dropdown button and edit the Home page.
* Copy and Paste code from widgetLayout.html into the editor as shown below
  ``` 
  <div class="knowledge-base clearfix">
     <!-- Copy Iorad code here...  -->
     {{category_tree}}
  </div>
  ```
* Click on the **JS** tab
* Copy and Paste JavaScript code from script.js into the location mentioned below.
``` Javascript
$(document).ready(function() {
  ... some existing code
  
  // Iorad starts here.
});
```

## Uservoice Webwidget

### To Install:
* Ask Uservoice support to turn on scripting on your web portal.
* Create a new integration application @ /admin/settings/api
* Remember to set the application's trusted setting to no.
* Remember the key and secret.
* Go to Web Portal tab
* Copy and paste the code snippet below into the ```<!-- JAVASCRIPT SNIPPET -->``` textarea.
```
<!-- third party libraries -->

<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
<!-- sha1 -->
<script src="https://crypto-js.googlecode.com/svn/tags/3.1.2/build/rollups/hmac-sha1.js"></script>
<!-- sha256 -->
<script src="https://crypto-js.googlecode.com/svn/tags/3.1.2/build/rollups/hmac-sha256.js"></script>

<script src="https://crypto-js.googlecode.com/svn/tags/3.1.2/build/components/enc-base64-min.js"></script>

<!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">

<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>

<!-- user setup required here. -->
<!-- Create an API key @ /admin/settings/api -->
<!-- Remember to set the API application to be untrusted. -->
<script>
  window.ioradWebWidgetApiKeys = {
    consumerPublic: 'Key',
    consumerSecret: 'Secret'
  };
</script>

<!-- uservoice webwidget. We should host this ourselves. -->

<script src="https://dl.dropboxusercontent.com/u/23292243/IoradWebWidget-Uservoice.js"></script>
```
Now go to your webportal to see the web widget working.

