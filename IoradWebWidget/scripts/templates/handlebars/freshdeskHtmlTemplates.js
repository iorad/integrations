this["JST"] = this["JST"] || {};

this["JST"]["templates/freshdesk/freshdeskCategoryList.hbs"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<option value=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "</option>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.categories : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"useData":true});

this["JST"]["templates/freshdesk/freshdeskFolderList.hbs"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<select id=\""
    + this.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"invisible-options\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.folders : depth0),{"name":"each","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</select>\n";
},"2":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "    <option value=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "</option> \n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.categories : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"useData":true});

this["JST"]["templates/freshdesk/mainLayout.hbs"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<section id=\"ioradWidget\" class=\"content rounded-6 iorad-widget hide-in-mobile\" title=\"Iorad Tutorial Widget\">\n    <div id=\"tutorialLocation\" class=\"widget-layout\">\n        <div class=\"widget-header\"><h2 class=\"heading\">Create a Solution</h2></div>\n        <div class=\"widget-body\">\n            <div class=\"widget-location-selector\">\n                <label class=\"selector-label\" for=\"categoryselector\">\n                    <h4>Categories</h4>\n                </label>\n                <div><select id=\"categorySelector\"></select></div>\n                <label class=\"selector-label\" for=\"foldersList\">\n                    <h4>Solutions</h4>\n                </label>\n                <div id='foldersList'></div>\n            </div>\n            <div class=\"widget-options\">\n                <input id=\"markAsPublished\" type=\"checkbox\">\n                <span> Automatically mark new tutorial as published?</span>\n            </div>\n        </div>\n        <div id=\"control\">\n            <a id='newTutorialBtn' class='btn btn-iorad-widget' title='open IORAD editor' href='#'>ADD</a>\n        </div>\n    </div>\n</section>\n<style>\n    .invisible-options {\n        display: none;\n    }\n\n    .iorad-widget {\n        border-bottom: 1px solid #e5e5e5;\n    }\n\n    @media (max-width: 1201px) {\n        .btn-iorad-widget {\n            color: #006063;\n            border-color: #006063;\n            font-weight: bold;\n            background-color: white;\n            background-image: none;\n            text-shadow: none;\n            width: 112px;\n            line-height: 20px;\n            display: block;\n        }\n        \n        .widget-body, .widget-header {\n            padding-bottom: 10px;\n        }\n    }\n\n    @media (min-width: 1201px) {\n        .iorad-widget div {\n            display: inline-block;\n        }\n        \n        .widget-body {\n            width:67%;\n        }\n\n        #control {\n            float: right;\n            position: relative;\n        }\n\n        .widget-location-selector .selector-label {\n            padding-right: 1em;\n            display: inline-block;\n        }\n\n        .widget-header {\n            padding-right: 2em;\n            float: left;\n        }\n        \n        .widget-location-selector div {\n            padding-right: 2em;\n        }\n\n        .btn-iorad-widget {\n            color: #006063;\n            border-color: #006063;\n            font-weight: bold;\n            background-color: white;\n            background-image: none;\n            text-shadow: none;\n            width: 112px;\n            line-height: 20px;\n            margin: 0 auto;\n            display: block;\n        }\n    }\n\n    .widget-layout {\n        width: 98%;\n    }   \n\n    .iorad-widget-modal {\n        width: 28%;\n        font-size: 16px;\n    }\n\n    \n</style>\n<script type='text/javascript' src='//"
    + this.escapeExpression(((helper = (helper = helpers.ioradRootUrl || (depth0 != null ? depth0.ioradRootUrl : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"ioradRootUrl","hash":{},"data":data}) : helper)))
    + "/server/assets/js/iorad.js'></script>\n";
},"useData":true});

this["JST"]["templates/freshdesk/modalTemplate.hbs"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=this.escapeExpression, alias2=this.lambda;

  return "<div class=\"modal hide fade iorad-widget-modal\" role=\"dialog\" id=\"successModal\" aria-hidden=\"true\" style=\"display:none;\">\n    <div class=\"modal-header\"></div>\n    <div class=\"modal-body\">\n        <div id=\"successMsg\">\n            The solution <b>"
    + alias1(((helper = (helper = helpers.articleTitle || (depth0 != null ? depth0.articleTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"articleTitle","hash":{},"data":data}) : helper)))
    + "</b> has been successfully created.\n        </div>\n    </div><div class=\"modal-footer\">\n        <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button><a class=\"btn btn-primary\" href=\"/solution/categories/"
    + alias1(alias2(((stack1 = (depth0 != null ? depth0.article : depth0)) != null ? stack1.categoryId : stack1), depth0))
    + "/folders/"
    + alias1(alias2(((stack1 = (depth0 != null ? depth0.article : depth0)) != null ? stack1.folderId : stack1), depth0))
    + "/articles/"
    + alias1(alias2(((stack1 = (depth0 != null ? depth0.article : depth0)) != null ? stack1.id : stack1), depth0))
    + "\">VIEW ARTICLE</a>\n    </div>\n</div>\n";
},"useData":true});

this["JST"]["templates/articleTemplate.hbs"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "    <p>"
    + this.escapeExpression(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"description","hash":{},"data":data}) : helper)))
    + "</p>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class=\"embeddedTutorial\"><iframe src=\""
    + this.escapeExpression(((helper = (helper = helpers.iframeSrc || (depth0 != null ? depth0.iframeSrc : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"iframeSrc","hash":{},"data":data}) : helper)))
    + "\" width=\"100%\" scrolling=\"no\" height=\"500px\" style=\"border:0px;\" allowfullscreen=\"true\"></iframe></div>\n<div class=\"tutorialSteps\" style=\"display: none;\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.steps : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</div>\n";
},"useData":true});