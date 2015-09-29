ioradFreshplug.templates = (function (module, win, undefined) {
  module.insertIoradButtonTemplate = function () {
    var template = win["JST"]["templates/insertIoradButtonTemplate.hbs"];
    return template();
  };

  module.inputControlTemplate = function (inputControlData) {
    var template = win["JST"]["templates/inputControlTemplate.hbs"];
    return template({
      categories: inputControlData.categories,
      folders: inputControlData.folders,
      addToKnowledgebase: inputControlData.addToKnowledgebase,
      markAsPublished: inputControlData.markAsPublished
    });
  };

  module.insertSolutionModal = function () {
    var template = win["JST"]["templates/insertSolutionModal.hbs"];
    return template();
  };

  module.getHyperLink = function (href, content) {
    var template = win["JST"]["templates/hyperLinkTemplate.hbs"];
    return template({ href: href, content: content });
  };

  module.addToKnowledgebaseButtonTemplate = function () {
    var template = win["JST"]["templates/insertKnowledgebaseSolutionButtonTemplate.hbs"];
    return template();
  };

  // display a modal indicating that article is successfully created in knowledge base.
  module.articleCreatedModalTemplate = function (article, isTicketingView) {
    var template = win["JST"]["templates/knowledgebaseArticleCreatedModal.hbs"];
    return template({ articleTitle: article.title, articleHref: article.href, freshplugTicketingView: isTicketingView});
  };

  return module;
})(ioradFreshplug.templates || {}, window);
