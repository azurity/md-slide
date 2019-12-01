const yaml = require('js-yaml')
const entities = require('entities')

module.exports = function(code) {
    try {
        let fonts = yaml.load(code)
        let content = []
        for (let font in fonts) {
            if (!font.match(/^\p{L}+$/u) || !fonts[font].match(/^[\p{L}"' ]+$/u)) continue
            content.push(`.font-${font} { font-family: ${fonts[font]}; }`)
        }
        return `<style>\n${content.join('\n')}\n</style>`
    } catch (e) {
        return ''
    }
}
