  $ = jQuery;
  var dialogProp;
  var dialogNew;
  var tutor_uid;
  var tutorialId;
  var tutorialTitle;
  var issue_id;
  $(document).ready(function() {


      dialogProp = new AJS.Dialog(400, 400);
      dialogProp.addHeader("Edit Properties");
      // dialogProp.addPage();

      dialogProp.addCancel("Cancel", function() {
          dialogProp.hide();
      });

      dialogProp.addPanel("SavePropPanel", "<img/><div>\r\n<label style=\"display:none\" >Width<\/label>\r\n<input style=\"display:none\" id=\"iframeWidth\" type=\"text\"\/>\r\n<\/div>\r\n<div>\r\n<label>Height<\/label>\r\n<input id=\"iframeHeight\" type=\"text\"\/>\r\n<\/div>\r\n\r\n<div>\r\n<label>Embed URL<\/label>\r\n<input id=\"iframeSrc\" type=\"text\"\/>\r\n<\/div>\r\n<a class=\"btnIoradSavePropPanel aui-button\" >Save Properties<\/a>   <a class=\"btnIoradEditPropPanel aui-button\" \">Edit Steps<\/a><a class=\"needHelpPropDial\" href=\"https://iorad.com/jira\" >Need Help?<\/a>", "SavePropPanel");


      $(".btnIoradSavePropPanel").bind("click", function() {
          issue_id = JIRA.Issue.getIssueId();
          savePluginData($("#iframeSrc").val(), issue_id, $("#iframeWidth").val(), $("#iframeHeight").val());
          dialogProp.hide();

      });




      $(".btnIoradEditPropPanel").bind("click", function() {



      });

      // dialogNew = new AJS.Dialog(400, 400);


      // dialogNew.addPage();

      // dialogNew.addCancel("Cancel", function() {
      //     dialogNew.hide();
      // });


      // // adds header for second page
      // // dialogNew.addHeader("Iorad Tutorials");
      // dialogNew.addPanel("NewSolutionPanel", "<div id=\"ioRadnewDiv\" ><img/><h2>DOCUMENT STEPS FOR YOUR ISSUE<\/h2><a class=\"btnIoradNew\" onclick=\"createNewSolution()\" >CAPTURE STEPS<\/a><a href=\"https://iorad.com/jira\" >Need Help?<\/a><\/div>", "NewSolutionPanel");





      $(".btnIoradEditPropPanel").bind("click", function() {



          editSteps();

      });



      $(".ioradinitmenu").click(function(e) {

          e.preventDefault();


          issueStatusCheck(false);


      });

      $(".ioradinitmenu").on("remove", function() {
          registerMenuItemHandler();
      })


  });

  function registerMenuItemHandler() {

      setTimeout(function() {



          if ($(".ioradinitmenu").length > 0) {

              $(".ioradinitmenu").click(function(e) {

                  e.preventDefault();


                  issueStatusCheck(false);


              });
          } else {
              registerMenuItemHandler();

          }


      }, 300);


  }


  function editSteps() {
      issue_id = JIRA.Issue.getIssueId();
      ioradInit(issue_id, true, false);
      dialogProp.hide();

  }

  function createNewSolution() {
      issue_id = JIRA.Issue.getIssueId();
      ioradInit(issue_id, false, false);
      //  dialogNew.hide();

  }



  function createNewSolutionFromPopup() {
      issue_id = JIRA.Issue.getIssueId();
      ioradInit(issue_id, false, true);
      //  dialogNew.hide();

  }


  function addHiddenFieldstoNewIssueForm(iframeURl, width, height, tutorialId, tutorialTitle, uid) {

      $(".aui .field-group").append('<input type="hidden" name="io_iframeURl" value="' + iframeURl + '">');
      $(".aui .field-group").append('<input type="hidden" name="io_width" value="' + width + '">');
      $(".aui .field-group").append('<input type="hidden" name="io_height" value="' + height + '">');
      $(".aui .field-group").append('<input type="hidden" name="io_tutorialId" value="' + tutorialId + '">');
      $(".aui .field-group").append('<input type="hidden" name="io_tutorialTitle" value="' + tutorialTitle + '">');
      $(".aui .field-group").append('<input type="hidden" name="io_uid" value="' + uid + '">');

  }

  function issueStatusCheck(editImidiately) {
      issue_id = JIRA.Issue.getIssueId();
      jQuery.ajax({
          url: AJS.params.baseURL + "/plugins/servlet/pluginstatusservlet",
          type: "GET",
          data: {
              issue_id: issue_id
          },
          success: function(data) {
              if (data.result === "existing") {
                  $("#iframeWidth").val(data.width);
                  $("#iframeHeight").val(data.height);
                  $("#iframeSrc").val(data.iframeURL);
                  tutor_uid = data.uid;
                  tutorialId = data.tutorialId;
                  tutorialTitle = data.tutorialTitle;
                  if (editImidiately == true) {
                      editSteps();
                  } else
                      dialogProp.show();



              } else if (data.result === "new") {
                  // dialogNew.show();
                  createNewSolution();

              }
          },
          error: function(data) {
              console.log("error" + data);
              alert("Something went wrong.");
          }

      });

  }
  //old signature function openPropertyPanelWithParams(iframURL, width, height, tutor_uid, tutorialId, tutorialTitle) 
  function openPropertyPanelWithParams() {

      issueStatusCheck(false);
  }



  function ioradInit(issue_id, isEdit, isNewfromPopup) {



 	var options = {};
    options.pluginType = "jira";
      iorad.init(options,function() {


          if (isEdit) {

              var tutorParams = {
                  uid: tutor_uid,
                  tutorialId: tutorialId,
                  tutorialTitle: tutorialTitle
              };
              iorad.editTutorial(tutorParams);


          } else {
              iorad.createTutorial();
          }
          iorad.on('editor:close', function(tutorialParams) {



              var iframeHTML = iorad.getEmbeddedPlayerUrl(tutorialParams.uid,
                  tutorialParams.tutorialId, tutorialParams.tutorialTitle);

              var src = getAttrsFromIframe(iframeHTML, "src")+"&plugin_type=jira";
              var width = getAttrsFromIframe(iframeHTML, "width");
              var height = getAttrsFromIframe(iframeHTML, "height");

              if (isNewfromPopup) {



                  addHiddenFieldstoNewIssueForm(src, width, height, tutorialParams.tutorialId, tutorialParams.tutorialTitle, tutorialParams.uid);

                  $(".btnCreateTutorialContainerInGroup").remove();
                  $(".field-group.newSolutionFromPopupButtonGroup").append('<iframe src="' + src + '" width="100%" scrolling="no" height="' + height + '" style="border:0px;min-width:100%;" allowfullscreen="true"></iframe>');


                  // $.cookie("iframeURl", src);
                  // $.cookie("width", width);
                  // $.cookie("height", height);
                  // $.cookie("tutorialId", tutorialParams.tutorialId);
                  // $.cookie("tutorialTitle", tutorialParams.tutorialTitle);
                  // $.cookie("uid", tutorialParams.uid);

              } else {
                  savePluginData(src, issue_id, width, height, tutorialParams);
              }

              //location.reload();


          });

      });

  }

  function getAttrsFromIframe(iframeStr, strSeek) {
      pattern = strSeek + "=\"";
      indexOfSeek = iframeStr.indexOf(pattern);
      iframeStr = iframeStr.substring(indexOfSeek + pattern.length);
      indexOfStolb = iframeStr.indexOf("\"");
      return iframeStr.substring(0, indexOfStolb);
  }


  function savePluginData(iframURL, issue_id, width, height, tutorialParams)

  {
      if (tutorialParams) {
          tutor_uid = tutorialParams.uid;
          tutorialId = tutorialParams.tutorialId;
          tutorialTitle = tutorialParams.tutorialTitle;
      }


      jQuery.ajax({
          url: AJS.params.baseURL + "/plugins/servlet/plugindataservlet",
          type: "GET",
          data: {
              iframeURl: iframURL,
              issue_id: issue_id,
              width: width,
              height: height,
              uid: tutor_uid,
              tutorialId: tutorialId,
              tutorialTitle: tutorialTitle
          },
          success: function(data) {
              if (data.result === "success") {

                  // alert("Solution successfully attached to the issue.");
                  location.reload();
                  //JIRA.trigger(JIRA.Events.REFRESH_ISSUE_PAGE, [JIRA.Issue.getIssueId()]);

              }
          },
          error: function(data) {
              console.log("error" + data);
              alert("Something went wrong.");
          }

      });

  }


  jQuery(document).ready(function($) {


      JIRA.bind(JIRA.Events.NEW_CONTENT_ADDED, function(e, context) {
          buildCreateIssueButton($(".aui .form-body .content"));

      });

      // if (String(document.location.href).indexOf("CreateIssue.jspa") >= 0 && $(".text.long-field").length) {
      //     buildCreateIssueButton($(".aui .form-body"));
      // }
  });

  function buildCreateIssueButton(nodeToAppend) {
      nodeToAppend.append('<div class="field-group newSolutionFromPopupButtonGroup"> <label >Issue Steps</label><div class="btnCreateTutorialContainerInGroup"><a class="btnIoradNewFromPopup btnIoradNew aui-button" onclick="createNewSolutionFromPopup()">Capture Issue Steps</a></br><h3>After capturing you can go ahead and create your issue.</h3></div></div>');

  }
