this["JST"] = this["JST"] || {};

this["JST"]["templates/freshdesk/freshdeskCategoryList.hbs"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<option value=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "</option>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.categories : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"useData":true});

this["JST"]["templates/freshdesk/freshdeskFolderList.hbs"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<select id=\""
    + this.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"invisible-options\">\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.folders : depth0),{"name":"each","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</select>\r\n";
},"2":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "    <option value=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "</option> \r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.categories : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"useData":true});

this["JST"]["templates/freshdesk/mainLayout.hbs"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<section id=\"ioradWidget\" class=\"content rounded-6 iorad-widget hide-in-mobile\" title=\"Iorad Tutorial Widget\">\r\n    <div id=\"tutorialLocation\" class=\"widget-layout\">\r\n        <div class=\"widget-header\"><h2 class=\"heading\">Create a Solution</h2></div>\r\n        <div class=\"widget-location-selector\"><div class=\"selector-label\"><h4>Categories</h4></div><div><select id=\"categorySelector\"></select></div></div>\r\n        <div class=\"widget-location-selector\"><div class=\"selector-label\"><h4>Solutions</h4></div><div id='foldersList'></div></div>\r\n        <div id=\"control\">\r\n            <a id='newTutorialBtn' class='btn btn-iorad-widget' title='open IORAD editor' href='#'>ADD</a>\r\n        </div>\r\n    </div>\r\n</section>\r\n<style>\r\n    .invisible-options {\r\n        display: none;\r\n    }\r\n\r\n    .iorad-widget {\r\n        border-bottom: 1px solid #e5e5e5;\r\n    }\r\n\r\n    @media (max-width: 1201px) {\r\n        .btn-iorad-widget {\r\n            color: #006063;\r\n            border-color: #006063;\r\n            font-weight: bold;\r\n            background-color: white;\r\n            background-image: none;\r\n            text-shadow: none;\r\n            width: 112px;\r\n            line-height: 20px;\r\n            display: block;\r\n        }\r\n    }\r\n\r\n    @media (min-width: 1201px) {\r\n        .iorad-widget div {\r\n            display: inline-block;\r\n        }\r\n\r\n        #control {\r\n            float: right;\r\n            position: relative;\r\n        }\r\n\r\n        .widget-location-selector .selector-label {\r\n            padding-right: 1em;\r\n        }\r\n\r\n        .widget-header {\r\n            padding-right: 2em;\r\n        }\r\n\r\n        .widget-location-selector {\r\n            padding-right: 2em;\r\n            height: 30px;\r\n        }\r\n\r\n        .btn-iorad-widget {\r\n            color: #006063;\r\n            border-color: #006063;\r\n            font-weight: bold;\r\n            background-color: white;\r\n            background-image: none;\r\n            text-shadow: none;\r\n            width: 112px;\r\n            line-height: 20px;\r\n            margin: 0 auto;\r\n            display: block;\r\n        }\r\n    }\r\n\r\n    .widget-layout {\r\n        width: 98%;\r\n    }   \r\n\r\n    .iorad-widget-modal {\r\n        width: 28%;\r\n        font-size: 16px;\r\n    }\r\n\r\n    \r\n</style>\r\n<script type='text/javascript' src='//iorad.com/server/assets/js/iorad.js'></script>\r\n";
},"useData":true});

this["JST"]["templates/freshdesk/modalTemplate.hbs"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=this.escapeExpression, alias2=this.lambda;

  return "<div class=\"modal hide fade iorad-widget-modal\" role=\"dialog\" id=\"successModal\" aria-hidden=\"true\" style=\"display:none;\">\r\n    <div class=\"modal-header\"></div>\r\n    <div class=\"modal-body\">\r\n        <div id=\"successMsg\">\r\n            The solution <b>"
    + alias1(((helper = (helper = helpers.articleTitle || (depth0 != null ? depth0.articleTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"articleTitle","hash":{},"data":data}) : helper)))
    + "</b> has been successfully created.\r\n        </div>\r\n    </div><div class=\"modal-footer\">\r\n        <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button><a class=\"btn btn-primary\" href=\"/solution/categories/"
    + alias1(alias2(((stack1 = (depth0 != null ? depth0.article : depth0)) != null ? stack1.categoryId : stack1), depth0))
    + "/folders/"
    + alias1(alias2(((stack1 = (depth0 != null ? depth0.article : depth0)) != null ? stack1.folderId : stack1), depth0))
    + "/articles/"
    + alias1(alias2(((stack1 = (depth0 != null ? depth0.article : depth0)) != null ? stack1.id : stack1), depth0))
    + "\">VIEW ARTICLE</a>\r\n    </div>\r\n</div>\r\n";
},"useData":true});