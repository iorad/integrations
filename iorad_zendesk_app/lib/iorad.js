var env         = 'live', // cfdev, prod or live; default: live.
  pluginType    = 'zendeskapp_tutorial_builder', // this is a nav bar app that creates tutorials.
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
    var referrer = location.href;
    return this.getBaseUrl() + '/server/?a=app.editor&data=0&src=iframe&referrer=' + referrer + '&plugin_type=' + pluginType;
  },

  existingTutorialEditorUrl: function (tutorialParams) {
    return this.getBaseUrl() + '/server/?a=app.editor&data=0&module=' + tutorialParams.tutorialId + '&uid=' + tutorialParams.uid;
  },

  /**
   * 
   * This method returns tutorial player url.
   * 
   * @param {string} uid            user id
   * @param {string} tutorialId     tutorial id
   * @param {string} tutorialTitle  tutorial title
   */
  getPlayerUrl: function (uid, tutorialId, tutorialTitle) {
    return [this.getBaseUrl(), uid, tutorialId, tutorialTitle].join('/');
  },

  /**
   * 
   * This method returns tutorial player url with viewsteps option turned on.
   * Note: this method is obselete.
   * 
   * @param {string} uid            user id
   * @param {string} tutorialId     tutorial id
   * @param {string} tutorialTitle  tutorial title
   */
  getPlayerUrlWithViewSteps: function (uid, tutorialId, tutorialTitle) {
    return this.getPlayerUrl(uid, tutorialId, tutorialTitle) + "#viewsteps";
  },

  /**
   * Extracts tutorial params from provided player url.
   *
   * @param {string} playerUrl  player url
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
   * @param  {string} uid           user id
   * @param  {string} tutorialId    tutorial id
   * @param  {string} tutorialTitle tutorial title
   * @return {string}               iframe html
   */
  getEmbeddedPlayerUrl: function (uid, tutorialId, tutorialTitle) {
    var playerUrl = this.getPlayerUrl(uid, tutorialId, tutorialTitle);
    return this.buildIframe(playerUrl);
  },

  /**
   * Gets embedded #viewsteps player url. This method is obselete.
   * @param  {string} uid           user id
   * @param  {string} tutorialId    tutorial id
   * @param  {string} tutorialTitle tutorial title
   * @return {string}               iframe html
   */
  getEmbeddedPlayerWithViewStepsUrl: function (uid, tutorialId, tutorialTitle) {
    var playerUrl = this.getPlayerUrlWithViewSteps(uid, tutorialId, tutorialTitle);
    return this.buildIframe(playerUrl);
  }
};