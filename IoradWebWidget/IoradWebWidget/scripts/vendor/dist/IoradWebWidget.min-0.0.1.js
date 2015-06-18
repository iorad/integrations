/*! IoradWebWidget 2015-06-17 */
this.JST=this.JST||{},this.JST["templates/mainLayout.hbs"]=Handlebars.template({compiler:[6,">= 2.0.0-beta.1"],main:function(a,b,c,d){return'<section id="ioradWidget" class="content rounded-6 iorad-widget hide-in-mobile" title="Iorad Tutorial Widget">\n    <div id="tutorialLocation" class="widget-layout">\n        <div class="widget-header"><h2 class="heading">Create a Solution</h2></div>\n        <div class="widget-location-selector"><div class="selector-label"><h4>Categories</h4></div><div><select id="categorySelector"></select></div></div>\n        <div class="widget-location-selector"><div class="selector-label"><h4>Solutions</h4></div><div id=\'foldersList\'></div></div>\n        <div id="control">\n            <a id=\'newTutorialBtn\' class=\'btn btn-iorad-widget\' title=\'open IORAD editor\' href=\'#\'>ADD</a>\n        </div>\n    </div>\n</section>\n<style>\n    .invisible-options {\n        display: none;\n    }\n\n    .iorad-widget {\n        border-bottom: 1px solid #e5e5e5;\n    }\n\n        .iorad-widget div {\n            display: inline-block;\n        }\n\n    #control {\n        float: right;\n        position: relative;\n    }\n\n    .widget-layout {\n        width: 98%;\n    }\n\n    .widget-header {\n        padding-right: 2em;\n    }\n\n    .widget-location-selector {\n        padding-right: 2em;\n        height: 30px;\n    }\n\n        .widget-location-selector .selector-label {\n            padding-right: 1em;\n        }\n\n    .btn-iorad-widget {\n        color: #006063;\n        border-color: #006063;\n        font-weight: bold;\n        background-color: white;\n        background-image: none;\n        text-shadow: none;\n        width: 112px;\n        line-height: 20px;\n        margin: 0 auto;\n        display: block;\n    }\n\n    .iorad-widget-modal {\n        width: 28%;\n        font-size: 16px;\n    }\n</style>\n<script type=\'text/javascript\' src=\'//iorad.com/server/assets/js/iorad.js\'></script>\n'},useData:!0}),this.JST["templates/modalTemplate.hbs"]=Handlebars.template({compiler:[6,">= 2.0.0-beta.1"],main:function(a,b,c,d){var e,f=b.helperMissing,g="function",h=this.escapeExpression;return'<div class="modal hide fade iorad-widget-modal" role="dialog" id="successModal" aria-hidden="true" style="display:none;">\n    <div class="modal-header"></div>\n    <div class="modal-body">\n        <div id="successMsg">\n            The solution <b>'+h((e=null!=(e=b.articleTitle||(null!=a?a.articleTitle:a))?e:f,typeof e===g?e.call(a,{name:"articleTitle",hash:{},data:d}):e))+'</b> has been successfully created.\n        </div>\n    </div><div class="modal-footer">\n        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button><a class="btn btn-primary" href="'+h((e=null!=(e=b.url||(null!=a?a.url:a))?e:f,typeof e===g?e.call(a,{name:"url",hash:{},data:d}):e))+'">VIEW ARTICLE</a>\n    </div>\n</div>\n'},useData:!0});var ioradWebWidget=function(a,b){return a={freshdesk:{},config:{},util:{},templates:{}}}(ioradWebWidget||{});ioradWebWidget.templates={mainLayout:function(){var a=JST["templates/mainLayout.hbs"];return a()},freshDeskModal:function(a,b){var c=JST["templates/modalTemplate.hbs"];return c({url:a,articleTitle:b})}},function(a,b){var c=a(".c-wrapper");c.html(ioradWebWidget.templates.mainLayout()+c.html());var d=function(){iorad=b.iorad||{};var c="/solution/categories.json",d="/solution/categories/{category_id}/folders/{folder_id}/articles.json",e=function(){return{dataType:"json",contentType:"application/json"}},f=function(){var b=e();return b.type="GET",b.url=c,a.ajax(b)},g=function(b,c,f){var g=e();return g.type="POST",g.url=d.replace("{category_id}",b.toString()).replace("{folder_id}",c.toString()),g.data=f,a.ajax(g)},h=function(b){var c=a(b.srcElement);a("#foldersList").children().each(function(b,c){a(c).addClass("invisible-options")}),a("#"+c.val()).removeClass("invisible-options")},i=function(b){var c="",d="";b.each(function(a){c+='<option value="'+a.category.id+'">'+a.category.name+"</option>";var b='<select id="'+a.category.id+'"class="invisible-options">';a.category.folders.each(function(a){b+='<option value="'+a.id+'">'+a.name+"</option>"}),b+="</select>",d+=b});var e=a("#categorySelector");e.html(c),a("#foldersList").html(d),a("#"+e.val()).removeClass("invisible-options"),e.click(h)};f().then(i,function(a){}),iorad.init({env:"live"},function(){var b=0;a("#newTutorialBtn").click(function(){a("body").addClass("iorad-loading"),iorad.createTutorial(),b=setTimeout(function(){a("body").removeClass("iorad-loading")},5e3),a("#iorad-editor").off().load(function(){a("body").addClass("iorad-open"),clearTimeout(b)})}),iorad.on("editor:close",function(c){a("body").removeClass("iorad-open iorad-loading"),clearTimeout(b);var d=iorad.getEmbeddedPlayerUrl(c.uid,c.tutorialId,c.tutorialTitle),e=a(d);e.attr("src",e.attr("src")+"#viewsteps");var f=a("#categorySelector").val(),h=a("#"+f).val(),i="/solution/categories/{categoryId}/folders/{folderId}/articles/{id}",j={solution_article:{title:c.tutorialTitle,folder_id:h,description:"<div>"+e.prop("outerHTML").replace(/\"/g,"'")+"</div>"}},k=JSON.stringify(j);g(f,h,k).then(function(b){var d=i.replace("{categoryId}",f).replace("{folderId}",h).replace("{id}",b.article.id);a("#successModal").length>0&&a("#successModal").remove(),a("body").append(ioradWebWidget.templates.freshDeskModal(d,c.tutorialTitle)),a("#successModal").modal("show")},function(a){})})})},e=function(a){var c=10,d=function(){b.iorad?a():b.setTimeout(d,c)};b.setTimeout(d,c)};e(d)}(jQuery,window);