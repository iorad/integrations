# Integrations
This repository contains several examples showing you how you can embed Iorad tutorial builder right in the heart of your chosen online Knowledgebase system.

## Freshplug

To Install: 
* go to [Helpdesk rebranding page](https://ioradapi.freshdesk.com/account/edit)
* Click on **Customize Portal**
* Click on the **Layout & pages** tab
* Go to Page layout editor
* Copy and Paste freshplug source code behind 
```
    <div class="page">
	    {{ header }}
```

## Freshplug for Freshdesk's new theme

To Install:
* go to [Helpdesk rebranding page](https://ioradapi.freshdesk.com/account/edit)
* Click on **Customize Portal**
* Click on the **Layout & pages** tab
* Go to Page layout editor
* Copy and Paste freshplug source code as instructed below. 
```
    <div class="c-wrapper">
      <!-- Start of fresh plug -->
      <!-- end of fresh plug -->
      {{ content_for_layout }}
    </div>
```

## Iorad Web Widget

Iorad Web Widget is built based on all available features from **Freshplug for Freshdesk's new theme** and aims to replace it as it is much easier for Help Center managers to plug and play in their Help Center system.

Currently, Iorad Web Widget only supports Fresh desk.
In the future, we will replace the Zendesk Help Center Widget with Iorad Web Widget. We will also be looking at possibilities with desk.com.

### To Build and play with Iorad Web Widget source code:
* install NPM - Package manager for Node.js
* Install Grunt.js ```[sudo] npm install -g grunt-cli```
* Install Bower ```[sudo] npm install -g bower```
* Run ``` grunt install-bower-packages```
* Run ``` grunt merge-js-files```
* Run ``` grunt min-js-file``` Only run this if you really wants to read a uglified javascript file :) So don't...

After you have successfully followed through the steps above, you will find IoradWebWidget.js in scripts/vendor/dist.

### To Install:
* go to [Helpdesk rebranding page](https://ioradapi.freshdesk.com/account/edit)
* Click on **Customize Portal**
* Click on the **Layout & pages** tab
* Go to **Page layout** editor
* Copy and Paste the source code below at the **end of the Page Layout file**.
```
{% if portal.user.is_agent %}
	<script type="text/javascript" src="url_coming_soon"></script>
{% endif %}
```

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
