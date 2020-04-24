import Handlebars from 'handlebars'
import isFunction from 'lodash/isFunction'
import manifest from '../../manifest.json'

// map to store the key/translation pairs of the loaded language
let translations

class I18n {
  constructor (locale) {
    this.loadTranslations(locale)
  }

  tryRequire (locale) {
    try {
      return require(`../../translations/${locale}.json`)
    } catch (e) {
      return null
    }
  }

  /**
   * Translate key with currently loaded translations,
   * optional context to replace the placeholders in the translation
   * @param {String} key
   * @param {Object} context object contains placeholder/value pairs
   * @return {String} tranlated string
   */
  t (key, context) {
    const keyType = typeof key
    if (keyType !== 'string') throw new Error(`Translation key must be a string, got: ${keyType}`)

    let template = translations[key]
    if (!template) throw new Error(`Missing translation: ${key}`)

    if (!isFunction(template)) {
      if (typeof template !== 'string') throw new Error(`Invalid translation for key: ${key}`)
      template = Handlebars.compile(template)
      translations[key] = template
    }

    return template(context)
  }

  loadTranslations (locale = 'en') {
    translations = this.tryRequire(locale) ||
                   this.tryRequire(locale.replace(/-.+$/, '')) ||
                   translations ||
                   this.tryRequire('en')
  }
}

Handlebars.registerHelper('t', function (key, context) {
  try {
    return (new I18n(manifest.defaultLocale)).t(key, context.hash)
  } catch (e) {
    console.error(e)
    return e.message
  }
})

export default new I18n(manifest.defaultLocale)
