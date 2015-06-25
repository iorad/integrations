  
var dialogParam=null;
var macroNode=null;


AJS.Confluence.PropertyPanel.Macro.registerButtonHandler("properties", function(e, macroNodeExt) {
macroNode = macroNodeExt;
if(dialogParam==null){
 dialogParam = new AJS.Dialog(400,400);


        dialogParam.addPage();

      dialogParam.addCancel("Cancel", function() {
              dialogParam.hide();
           });





      // adds header for second page
      dialogParam.addHeader("Iorad Properties");
      dialogParam.addPanel("SavePropPanel", "<div>\r\n<label>Width<\/label>\r\n<input id=\"iframeWidth\" type=\"text\"\/>\r\n<\/div>\r\n<div>\r\n<label>Height<\/label>\r\n<input id=\"iframeHeight\" type=\"text\"\/>\r\n<\/div>\r\n\r\n<div>\r\n<label>Embed URL<\/label>\r\n<input id=\"iframeSrc\" type=\"text\"\/>\r\n<\/div>\r\n<a class=\"btnIoradSave\" >Save Changes<\/a>", "SavePropPanel");
  

$( ".btnIoradSave" ).bind( "click", function() {

saveMacroParams(macroNode);

});
  }


    updateMacroProp(macroNodeExt);
});







var updateMacroProp = function(macroNode) {


     var node = macroNode.attributes["data-macro-parameters"];

      var macroParams  = node.nodeValue;

$("#iframeWidth").val(getValueFromString(macroParams,"iframeWidth"));
$("#iframeHeight").val(getValueFromString(macroParams,"iframeHeight"));
$("#iframeSrc").val(getValueFromString(macroParams,"iframeSrc"));
      
dialogParam.show();

 
}



function saveMacroParams(macroNode){
     var node = macroNode.attributes["data-macro-parameters"];

    var macroParams  = node.nodeValue;
    var macroRenderRequest = {
        contentId: Confluence.Editor.getContentId(),
        macro: {
            name: macroName,
            params: {"iframeSrc": $("#iframeSrc").val(), 
        			 "iframeWidth": $("#iframeWidth").val(),
        			 "iframeHeight": $("#iframeHeight").val()},
            defaultParameterValue: "",
            body : ""
        }
    };

   tinymce.confluence.MacroUtils.insertMacro(macroRenderRequest);
dialogParam.hide();
}