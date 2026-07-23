# Integrations
This repository contains several examples showing you how you can embed Iorad tutorial builder right in the heart of your chosen online Knowledgebase system.

## Iorad Web Widget

Iorad Web Widget can be easily installed by help center admins. Agents can create iorad articles/tutorials using Iorad straight from their Web Portal home page.

Currently, Iorad Web Widget only supports Fresh desk.
In the future, we will replace the Zendesk Help Center Widget with Iorad Web Widget. We will also be looking at possibilities with desk.com.

### To Build and play with Iorad Web Widget source code:
* Install Node.js version: 10.24.1
* Run ```cd IoradWebWidget```
* Run ```npm install --no-package-lock```
* Run ```./node_modules/.bin/grunt install-bower-packages```
* Run ```./node_modules/.bin/grunt build-freshdeskWebWidget-release```

After you have successfully followed through the steps above, you will find IoradWebWidget-*.js in scripts/vendor/dist.

### To Build and play with iorad_ticketing_freshplug:
* Install Node.js version: 10.24.1
* Run ```cd iorad_ticketing_freshplug/iorad_ticketing_freshplug```
* Run ```npm install --no-package-lock```
* Run ```./node_modules/.bin/grunt install-bower-packages```
* Run ```./node_modules/.bin/grunt build-freshplug```
* Run ```cp dist/ioradTicketingFreshplug.html dist/ioradTicketingFreshplug.txt```
* Run ```cp dist/ioradTicketingFreshplugDev.html dist/ioradTicketingFreshplugDev.txt```

After you have successfully followed through the steps above, you will find ioradTicketingFreshplug* in the dist directory.

## To build and play with iorad_zendesk_app:
* Run ```cd iorad_zendesk_app``
* Run ```./build.sh```

After you have successfully followed through the steps above, you will find app.zip in the dist directory.

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
