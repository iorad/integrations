/**
 * {
 *   name: 'test app',
 *   author: {
 *     title: 'the author',
 *     value: 'mr programmer'
 *   },
 *   app: {
 *     instructions: 'install',
 *     steps: {
 *       click: 'this button'
 *     }
 *   }
 * }
 *
 * becomes
 *
 * {
 *   name: 'test app',
 *   author: 'mr programmer',
 *   app.instructions: 'install',
 *   app.steps.click: 'this button'
 * }
 */

const loaderUtils = require('loader-utils')
const handlebars = require('handlebars')
const hb = handlebars.create()

function translationFlatten (object, currentKeys = []) {
  const res = {}

  Object.keys(object).map(key => {
    const value = object[key]
    if (typeof value === 'object') {
      if (value.title && value.value) {
        const flattenedKey = [...currentKeys, key].join('.')
        res[flattenedKey] = value.value
      } else {
        Object.assign(res, translationFlatten(value, [...currentKeys, key]))
      }
    } else {
      const flattenedKey = [...currentKeys, key].join('.')
      res[flattenedKey] = value
    }
  })

  return res
}

function compileTranslations (translations) {
  const flattenedTranslations = translationFlatten(translations)
  const rows = Object.keys(flattenedTranslations).map(function (translationKey) {
    const template = hb.precompile(flattenedTranslations[translationKey])
    return `${JSON.stringify(
      translationKey
    )}: (Handlebars["default"] || Handlebars).template(${template})`
  })
  return `{ ${rows.join(',\n')} }`
}

function TranslationsLoader (content) {
  let translationsInput
  try {
    translationsInput = JSON.parse(content)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }

  const options = loaderUtils.getOptions(this)
  const runtimePath = options.runtime || require.resolve('handlebars/runtime')

  const compiledTranslations = compileTranslations(translationsInput)
  return `
    var Handlebars = require(${JSON.stringify(runtimePath)});
    module.exports = ${compiledTranslations};
  `
}

module.exports = TranslationsLoader
