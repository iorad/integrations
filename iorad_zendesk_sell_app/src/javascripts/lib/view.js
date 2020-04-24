import $ from 'jquery'
import isFunction from 'lodash/isFunction'

class View {
  constructor (opts = {}) {
    this.afterRender = opts.afterRender
  }

  renderTemplate (name, data) {
    let template = require(`../../templates/${name}.hdbs`)
    return template(data)
  }

  switchTo (name, data) {
    $('[data-main]').html(this.renderTemplate(name, data))
    isFunction(this.afterRender) && this.afterRender()
  }

  switchToChlid (name, selector, data) {
    $('[data-main]').find(selector).html(this.renderTemplate(name, data))
    isFunction(this.afterRender) && this.afterRender()
  }
}

export default View
