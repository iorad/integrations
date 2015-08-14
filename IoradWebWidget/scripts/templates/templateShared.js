// This template displays an solution article to be created.
ioradWebWidget.templates.articleTemplate = function (tutorialIframe, steps) {
  var template = JST['templates/articleTemplate.hbs'];
  return template({ iframeSrc: tutorialIframe, steps: steps });
};
