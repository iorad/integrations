AJS.bind("init.rte", function() { 
   
   
   // var macroName = 'CaptureSolution';

    // 1. create dialog to add macro
    //var dialog = new AJS.Dialog(400, 320);

    var dialogNew = new AJS.Dialog(400,400);


        dialogNew.addPage();

      dialogNew.addCancel("Cancel", function() {
              dialogNew.hide();
           });


      // adds header for second page
      dialogNew.addHeader("Iorad Tutorials");
      dialogNew.addPanel("SinglePanel", "<div id=\"ioRadnewDiv\" ><h2>Iorad article maker<\/h2><h3>Instant step-by-step knowledge base articles<\/h3><a class=\"btnIorad\" >New Solution<\/a><\/div>", "singlePanel");
  
   var dialogEdit = new AJS.Dialog(400,400);
   
        dialogEdit.addPage();

      dialogEdit.addCancel("Cancel", function() {
              dialogEdit.hide();
           });


      // adds header for second page
      dialogEdit.addHeader("Iorad Tutorials");
      dialogEdit.addPanel("SinglePanel", "<div id=\"ioRadEditDiv\" ><h2>Iorad article maker<\/h2><h3>Instant step-by-step knowledge base articles<\/h3><a class=\"btnIoradEdit\" >Edit Solution<\/a><\/div>", "singlePanel");
  

   

$( ".btnIoradEdit" ).bind( "click", function() {

var selection = AJS.Rte.getEditor().selection.getNode();
      var node = selection.attributes["data-macro-parameters"];

      var macroParams  = node.nodeValue;

  var tutorParams={
              uid:getValueFromString(macroParams,"uid"),
              tutorialId:getValueFromString(macroParams,"tutorId"),
              tutorialTitle:getValueFromString(macroParams,"tutorTitle")

              };


ioradInit(tutorParams);

});



$( ".btnIorad" ).bind( "click", function() {


ioradInit();


});


function ioradInit(tutorialParam)
{


  iorad.init( function() {


if(tutorialParam){

  iorad.editTutorial(tutorialParam);
}
  else{
  iorad.createTutorial();
    }


iorad.on('editor:close', function(tutorialParams) {



     var iframeHTML = iorad.getEmbeddedPlayerUrl(tutorialParams.uid,
                            tutorialParams.tutorialId, tutorialParams.tutorialTitle);     
    

     // get current selection in editor

        var selection = AJS.Rte.getEditor().selection.getNode();


        var macro = {
                name: macroName,
                params: {
                uid:tutorialParams.uid,
                tutorId:tutorialParams.tutorialId, 
                tutorTitle:tutorialParams.tutorialTitle,
                iframeSrc:getAttrsFromIframe(iframeHTML,"src"),
                iframeHeight:getAttrsFromIframe(iframeHTML,"height"),
                iframeWidth:getAttrsFromIframe(iframeHTML,"width")
            }
        };
        
        // convert macro and insert in DOM
        tinymce.plugins.Autoconvert.convertMacroToDom(macro, function(data, textStatus, jqXHR ) {
         
            AJS.$(selection).html(data + "<p><br/></p>");
        }, function(jqXHR, textStatus, errorThrown ) {
            AJS.log("error converting macro to DOM");
        });
        dialogEdit.hide();
        dialogNew.hide();


  });

});

}


    

    // 5. bind event to open macro browser
    AJS.MacroBrowser.setMacroJsOverride(macroName, {opener: function(macro) {
        // open custom dialog
//;
      var selection = AJS.Rte.getEditor().selection.getNode();
      var node = selection.attributes["data-macro-parameters"];
       if(node && node.nodeValue!=""){
        dialogEdit.show();

       }else
       {
        dialogNew.show();
       }
              
          }});


});


function getValueFromString(strsource, strSeek)
{

  pattern = "|"+strSeek+"=";
  indexOfSeek = strsource.indexOf(pattern);
  strsource = strsource.substring(indexOfSeek+pattern.length);
indexOfStolb = strsource.indexOf("|");
return indexOfStolb==-1?strsource:strsource.substring(0,indexOfStolb);


}


function getAttrsFromIframe(iframeStr,strSeek){
pattern = strSeek+"=\"";
indexOfSeek = iframeStr.indexOf(pattern);
iframeStr = iframeStr.substring(indexOfSeek+pattern.length);
indexOfStolb = iframeStr.indexOf("\"");
return iframeStr.substring(0,indexOfStolb);
}