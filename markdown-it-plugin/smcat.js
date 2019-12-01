const entities = require('entities')
const smcat = require('state-machine-cat')

module.exports = function(code) {
    try {
        let result = smcat.render(code, {
            inputType: 'smcat',
            outputType: 'svg'
        })
        return `<div class="smcat">${result}</div>`
    } catch (e) {
        return `<pre>${entities.encodeHTML5(code)}</pre>`
    }
}
