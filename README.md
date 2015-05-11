# Integrations
This repository contains several examples showing you how you can embed Iorad tutorial builder right in the heart of your chosen online Knowledgebase system.

## Freshplug

To Install: 
* go to [Helpdesk rebranding page](https://ioradapi.freshdesk.com/account/edit)
* Click on **Customize Portal**
* Click on the **Layout & pages** tab
* Go to Pay layout editor
* Copy and Paste freshplug source code behind 
```
    <div class="page">
	    {{ header }}
```

## Zendesk Help Center

To Install: (Assume Help Center is enabled.)
* Go to **General Settings** and enable **Display unsafe content**
* In Help Center, Click on **Customize Design**
* Click on **Edit Theme** to go to Help Center's Theme Editor.
* Click on the dropdown button and edit the Section page.
* Copy and Paste code from widgetLayout.html into the editor, after 
  ``` 
  <nav class="sub-nav">
    {{breadcrumbs}}
    {{subscribe}}
  </nav>
  
   <!-- Copy Iorad code here...  -->
  ```
* Click on the **JS** tab
* Copy and Paste JavaScript code from script.js to the top of the editor.
* Run the function in the existing Javascript.
``` Javascript
$(document).ready(function() {
  ... some existing code
  
  // run iorad like this.
  // Iorad starts here.
  ioradWidget();
});
```
