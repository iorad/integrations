let env = 'live' // cfdev, prod or live; default: live.
let customBaseUrl = '' // baseUrl when this variable is set

module.exports = {

  buildIframe: function (playerUrl) {
    return "<iframe src='" + playerUrl + "' width='100%' scrolling='no' height='500px' style='border:2px solid #ebebeb;' allowfullscreen='true'></iframe>"
  },

  getBaseUrl: function () {
    if (customBaseUrl !== '') {
      return customBaseUrl
    }

    let baseUrl
    switch (env) {
      case 'dev':
        baseUrl = 'https://dev.iorad.local'
        break

      case 'test':
        baseUrl = 'https://test.iorad.com'
        break

      default:
        baseUrl = 'https://www.iorad.com'
        break
    }

    return baseUrl
  },

  /**
     *
     * @param pluginType
     * @return {string} tutorial editor url.
     */
  newTutorialEditorUrl: function (pluginType) {
    return this.getBaseUrl() + '/createNewTutorial?plugin_type=' + pluginType
  },

  existingTutorialEditorUrl: function (tutorialParams, pluginType) {
    return this.getBaseUrl() + '/editor/?plugin_type=' + pluginType + '&module=' + tutorialParams.tutorialId + '&uid=' + tutorialParams.uid
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
    const results = []
    const parts = [this.getBaseUrl(), 'player', uid, tutorialId, tutorialTitle]
    for (let i = 0; i < parts.length; i++) {
      if (parts[i]) {
        results.push(parts[i])
      }
    }
    return results.join('/')
  },

  /**
     * Extracts tutorial params from provided player url.
     *
     * @param {string} playerUrl  player url
     *
     * @return object with base_url, uid, tutorialId, tutorialTitle
     */
  extractTutorialParams: function (playerUrl) {
    const splits = playerUrl.split('/')
    const len = splits.length

    return {
      base_url: splits[len - 4],
      uid: splits[len - 3],
      tutorialId: splits[len - 2],
      tutorialTitle: splits[len - 1]
    }
  },

  /**
     * Gets embedded player url.
     * @param  {string} uid           user id
     * @param  {string} tutorialId    tutorial id
     * @param  {string} tutorialTitle tutorial title
     * @return {string}               iframe html
     */
  getEmbeddedPlayerUrl: function (uid, tutorialId, tutorialTitle) {
    const playerUrl = this.getPlayerUrl(uid, tutorialId, tutorialTitle)
    return this.buildIframe(playerUrl)
  }
}
