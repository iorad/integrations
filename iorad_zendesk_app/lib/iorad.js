var env         = 'prod', // cfdev, prod or live; default: live.
  customBaseUrl = ''; //baseUrl when this variable is set
module.exports = {
  buildIframe: function (playerUrl) {
    return "<iframe src='" + playerUrl + "' width='100%' scrolling='no' height='500px' style='border:0px;' allowfullscreen='true'></iframe>";
  },

  getBaseUrl: function () {
    if (customBaseUrl !== '') {
      return customBaseUrl;
    }

    var baseUrl;
    switch (env) {
    case 'cfdev':
      baseUrl = '//localhost:8001';
      break;
    case 'prod':
      baseUrl = '//test.iorad.com';
      break;
    default:
      baseUrl = '//www.iorad.com';
      break;
    }

    return baseUrl;
  },

  newTutorialEditorUrl: function () {
    return this.getBaseUrl() + '/server/?a=app.editor&data=0&src=iframe';
  },

  existingTutorialEditorUrl: function (tutorialParams) {
    return this.getBaseUrl() + '/server/?a=app.editor&data=0&module=' + tutorialParams.tutorialId + '&uid=' + tutorialParams.uid;
  },

  getPlayerUrl: function (uid, tutorialId, tutorialTitle) {
    return [this.getBaseUrl(), uid, tutorialId, tutorialTitle].join('/');
  },

  getPlayerUrlWithViewSteps: function (uid, tutorialId, tutorialTitle) {
    return this.getPlayerUrl(uid, tutorialId, tutorialTitle) + "#viewsteps";
  },

  /**
   * Extracts tutorial params from provided player url.
   *
   * @param playerUrl
   *
   * @return object with base_url, uid, tutorialId, tutorialTitle
   */
  extractTutorialParams: function (playerUrl) {
    var splits = playerUrl.split('/'),
      len = splits.length;

    return {
      base_url: splits[len - 4],
      uid: splits[len - 3],
      tutorialId: splits[len - 2],
      tutorialTitle: splits[len - 1]
    };
  },

  /**
   * Gets embedded player url.
   * @param  {string} uid           [description]
   * @param  {string} tutorialId    [description]
   * @param  {string} tutorialTitle [description]
   * @return {string}               [description]
   */
  getEmbeddedPlayerUrl: function (uid, tutorialId, tutorialTitle) {
    var playerUrl = this.getPlayerUrl(uid, tutorialId, tutorialTitle);
    return this.buildIframe(playerUrl);
  },

  /**
   * Gets embedded #viewsteps player url.
   * @param  {string} uid           [description]
   * @param  {string} tutorialId    [description]
   * @param  {string} tutorialTitle [description]
   * @return {string}               [description]
   */
  getEmbeddedPlayerWithViewStepsUrl: function (uid, tutorialId, tutorialTitle) {
    var playerUrl = this.getPlayerUrlWithViewSteps(uid, tutorialId, tutorialTitle);
    return this.buildIframe(playerUrl);
  }
};