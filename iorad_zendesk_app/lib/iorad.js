var env         = 'live', // cfdev, prod or live; default: live.
  customBaseUrl = ''; //baseUrl when this variable is set
module.exports = {
  buildIframe: function (playerUrl) {
    return "<iframe src='" + playerUrl + "' width='100%' scrolling='no' height='500px' style='border:2px solid #ebebeb;' allowfullscreen='true'></iframe>";
  },

  getBaseUrl: function () {
    if (customBaseUrl !== '') {
      return customBaseUrl;
    }

    var baseUrl;
    switch (env) {
    case 'cfdev':
      baseUrl = 'https://localhost:8001';
      break;
    case 'prod':
      baseUrl = 'https://test.iorad.com';
      break;
    default:
      baseUrl = 'https://www.iorad.com';
      break;
    }

    return baseUrl;
  },

  /**
   *
   * @param  {string} href location of current app.
   * @return {string}      tutorial editor url.
   */
  newTutorialEditorUrl: function (pluginType) {
    return this.getBaseUrl() + '/createNewTutorial?plugin_type=' + pluginType;

  },

  existingTutorialEditorUrl: function (tutorialParams, pluginType) {
    return this.getBaseUrl() + '/editor/?plugin_type=' + pluginType + '&module=' + tutorialParams.tutorialId + '&uid=' + tutorialParams.uid;
  },

  /**
   *
   * This method returns tutorial player url.
   *
   * @param {string} uid            user id
   * @param {string} tutorialId     tutorial id
   * @param {string} tutorialTitle  tutorial title
   * @param {string} tutorialIdKey  tutorial id key
   */
  getPlayerUrl: function (uid, tutorialId, tutorialTitle, tutorialIdKey) {
    return [this.getBaseUrl(), 'player', uid, tutorialId, tutorialTitle].join('/') +
      (tutorialIdKey ? '?tutorialIdKey=' + encodeURIComponent(tutorialIdKey) : '');
  },

  /**
   *
   * This method returns tutorial player url with viewsteps option turned on.
   * Note: this method is obselete.
   *
   * @param {string} uid            user id
   * @param {string} tutorialId     tutorial id
   * @param {string} tutorialTitle  tutorial title
   * @param {string} tutorialIdKey  tutorial id key
   */
  getPlayerUrlWithViewSteps: function (uid, tutorialId, tutorialTitle, tutorialIdKey) {
    return this.getPlayerUrl(uid, tutorialId, tutorialTitle, tutorialIdKey) + "#viewsteps";
  },

  /**
   * Extracts tutorial params from provided player url.
   *
   * @param {string} playerUrl  player url
   *
   * @return object with base_url, uid, tutorialId, tutorialTitle
   */
  extractTutorialParams: function (playerUrl) {
    var splits = playerUrl.split('?')[0].split('/'),
      len = splits.length;
    var tutorialIdKey = decodeURIComponent(
      ((playerUrl.split('?')[1] || '').split('#')[0].match(/(^|&)tutorialIdKey=(.+?)($|&)/) || [])[2] || ''
    );

    return {
      base_url: splits[len - 4],
      uid: splits[len - 3],
      tutorialId: splits[len - 2],
      tutorialTitle: splits[len - 1],
      tutorialIdKey: tutorialIdKey
    };
  },

  /**
   * Gets embedded player url.
   * @param  {string} uid           user id
   * @param  {string} tutorialId    tutorial id
   * @param  {string} tutorialTitle tutorial title
   * @param  {string} tutorialIdKey tutorial id key
   * @return {string}               iframe html
   */
  getEmbeddedPlayerUrl: function (uid, tutorialId, tutorialTitle, tutorialIdKey) {
    var playerUrl = this.getPlayerUrl(uid, tutorialId, tutorialTitle, tutorialIdKey);
    return this.buildIframe(playerUrl);
  },

  /**
   * Gets embedded #viewsteps player url. This method is obselete.
   * @param  {string} uid           user id
   * @param  {string} tutorialId    tutorial id
   * @param  {string} tutorialTitle tutorial title
   * @param  {string} tutorialIdKey tutorial id key
   * @return {string}               iframe html
   */
  getEmbeddedPlayerWithViewStepsUrl: function (uid, tutorialId, tutorialTitle, tutorialIdKey) {
    var playerUrl = this.getPlayerUrlWithViewSteps(uid, tutorialId, tutorialTitle, tutorialIdKey);
    return this.buildIframe(playerUrl);
  }
};
