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
