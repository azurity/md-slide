const yaml = require('js-yaml')

module.exports = function(code) {
    try {
        let fonts = yaml.load(code)
        let content = []
        for (let font in fonts) {
            content.push(`.font-${font} { font-family: ${fonts[font]}; }`)
        }
        return `<style>\n${content.join('\n')}\n</style>`
    } catch (e) {
        return ''
    }
}
