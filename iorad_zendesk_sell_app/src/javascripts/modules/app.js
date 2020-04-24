import I18n from '../../javascripts/lib/i18n'
import { resizeContainer } from '../lib/helpers'
import View from '../lib/view'
import Clipboard from 'clipboard'
import $ from 'jquery'

import '../../templates/main.scss'

class App {
  constructor (client, appData) {
    this._client = client
    this._appData = appData
    this._context = appData.context
    this._settings = {}

    this._view = new View({
      afterRender: () => {
        // Automatically resize the iframe based on document height, if it's not in the "nav_bar" location
        if (this._context.location !== 'nav_bar') {
          resizeContainer(this._client).then()
        }
      }
    })

    // this.initializePromise is only used in testing
    // indicate app initilization(including all async operations) is complete
    this.initializePromise = this.init()
    this.registerEvents()
  }

  /**
   * Initialize module, render main template
   */
  async init () {
    I18n.loadTranslations(this._appData.context.currentUser.locale)
    this._client.metadata().then(metadata => {
      this._settings = metadata.settings
      this.switchTo('main')

      this.loadTutorials()
    })
  }

  registerEvents () {
    this._client.on('app.activated', this.init)
    const $body = $('body')
    $body.on('change, keyup', '#search-iorad', e => this.loadTutorials($(e.currentTarget).val()))
    $body.on('click', '#next-page, #prev-page', e => this.loadTutorials($body.find('#search-iorad').val(), $(e.currentTarget).data('start')))
  }

  switchTo (name, data) {
    return this._view.switchTo(name, data)
  }
  switchToChlid (name, selector, data) {
    return this._view.switchToChlid(name, selector, data)
  }

  renderTemplate (name, data) {
    return this._view.renderTemplate(name, data)
  }

  /**
   * Handle error
   * @param {Object} error error object
   */
  _handleError (error) {
    console.error('An error is handled here: ', error.message)
  }

  async loadTutorials (text = '', start = 0) {
    const count = 5
    const tutorials = await this._client
      .request({
        url: `https://www.iorad.com/api/tutorial/search?draft=false&sk=${text}&onlyOwn=true&onlyShared=falseN&start=${start}&count=${count}&sort=tutorialLastEditDate,desc`,
        dataType: 'json',
        headers: {'authorization': this._settings['iorad_secret']},
        // secure: true,
        type: 'GET',
        contentType: 'application/json',
      })
      .catch(this._handleError)

    this.switchToChlid('tutorial_table', '#tutorial_table_container', {
      'tutorials': tutorials
    })

    this.switchToChlid('tutorial_pagination', '#tutorial_pagination_container', {
      'prev': start > 0 ? `${start - count}` : false,
      'next': tutorials.length >= count ? `${start + count}` : false
    })

    const clipboard = new Clipboard('.copy')
    clipboard.on('success', function (e) {
      e.clearSelection()
      e.trigger.innerHTML = 'copied!'
      window.setTimeout(() => {
        e.trigger.innerHTML = 'copy'
      }, 2000)
    })
  }
}

export default App
