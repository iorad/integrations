this["JST"] = this["JST"] || {};

this["JST"]["templates/hyperLinkTemplate.hbs"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<a href=\""
    + alias3(((helper = (helper = helpers.href || (depth0 != null ? depth0.href : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"href","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.content || (depth0 != null ? depth0.content : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"content","hash":{},"data":data}) : helper)))
    + "</a>";
},"useData":true});

this["JST"]["templates/inputControlTemplate.hbs"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return " checked";
},"3":function(depth0,helpers,partials,data) {
    var stack1;

  return "    <div class=\"input-control\">\r\n        <label for=\"selectCategory\">Categories<span class=\"required_star\">*</span></label>\r\n        <select class=\"categoryOptions field\" id=\"categorySelector\">\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.categories : depth0),{"name":"each","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </select>\r\n    </div>\r\n    <div class=\"input-control\">\r\n        <label for=\"selectSection\">Solutions<span class=\"required_star\">*</span></label>\r\n        <select class=\"sectionOptions\" id=\"folderSelector\">\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.folders : depth0),{"name":"each","hash":{},"fn":this.program(7, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </select>\r\n    </div>\r\n    <div class=\"input-control\">\r\n        <input id=\"markAsPublished\" type=\"checkbox\" "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.markAsPublished : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "> Automatically mark new tutorial as published.\r\n    </div>\r\n";
},"4":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <option value=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\""
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.checked : depth0),{"name":"if","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ">\r\n                "
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "\r\n            </option>\r\n";
},"5":function(depth0,helpers,partials,data) {
    return " selected ";
},"7":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <option value=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "</option>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"body-input-control\">\r\n    <div class=\"input-control\">\r\n        <input type=\"checkbox\" id=\"addToKnowledgebaseToggle\" "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.addToKnowledgebase : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "> Auto-add Solution to Knowledge Base\r\n    </div>\r\n    <div class=\"loading hide\">loading...</div>\r\n\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.addToKnowledgebase : depth0),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\r\n    <div class=\"input-control\">\r\n        <button id=\"newTutorial\" class=\"btn btn-iorad-widget btn-primary\" title=\"CAPTURE SOLUTION\">CAPTURE SOLUTION</button>\r\n    </div>\r\n</div>\r\n";
},"useData":true});

this["JST"]["templates/insertIoradButtonTemplate.hbs"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<li class=\"redactor_separator\"></li>\r\n<li>\r\n	<a href=\"#\" class=\"insert_iorad tooltip\" data-editor-id=\"cnt-reply-body\" rel=\"ticket_iorad\" data-original-title=\"Insert Iorad Screen Capture\">Iorad</a>\r\n</li>\r\n";
},"useData":true});

this["JST"]["templates/insertKnowledgebaseSolutionButtonTemplate.hbs"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<li class=\"ticket-btns\">\r\n    <div id=\"insertIoradToKnowledgebaseButton\" class=\"btn tooltip\"\r\n         data-original-title=\"Iorad\" twipsy-content-set=\"true\">\r\n        <img src=\"//iorad.com/server/assets/img/icon_iorad_freshdesk.png\" style=\"height: 14px;\" />\r\n        <span> Create Knowledgebase solution</span>\r\n    </div>\r\n</li>\r\n";
},"useData":true});

this["JST"]["templates/insertSolutionModal.hbs"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"modal fade in\" role=\"dialog\" aria-hidden=\"false\" id=\"insert_iorad_solution\" style=\"width: 710px; margin-left: -355px;\">\r\n    <div class=\"modal-header\">\r\n        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\"></button>\r\n        <h3 class=\"ellipsis modal-title\" title=\"Iorad Screen Capture\">Iorad Screen Capture</h3>\r\n    </div>\r\n    <div class=\"modal-body\">\r\n    </div>\r\n</div>\r\n";
},"useData":true});

this["JST"]["templates/knowledgebaseArticleCreatedModal.hbs"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return " and a link has been attached to the ticket";
},"3":function(depth0,helpers,partials,data) {
    return "Return to ticket";
},"5":function(depth0,helpers,partials,data) {
    return "Close";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"modal fade iorad-widget-modal\" role=\"dialog\" id=\"successModal\" aria-hidden=\"false\">\r\n    <div class=\"modal-header\">\r\n        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\"></button>\r\n        <h3 class=\"ellipsis modal-title\">Article Created!</h3>\r\n    </div>\r\n    <div class=\"modal-body\">\r\n        The solution <b>"
    + alias3(((helper = (helper = helpers.articleTitle || (depth0 != null ? depth0.articleTitle : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"articleTitle","hash":{},"data":data}) : helper)))
    + "</b> has been successfully created"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.freshplugTicketingView : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ".\r\n    </div>\r\n    <div class=\"modal-footer\">\r\n        <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.freshplugTicketingView : depth0),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.program(5, data, 0),"data":data})) != null ? stack1 : "")
    + "</button>\r\n        <a class=\"btn btn-primary\" href=\""
    + alias3(((helper = (helper = helpers.articleHref || (depth0 != null ? depth0.articleHref : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"articleHref","hash":{},"data":data}) : helper)))
    + "\">VIEW ARTICLE</a>\r\n    </div>\r\n</div>\r\n";
},"useData":true});