const smcat = require('state-machine-cat')

module.exports = function(code) {
    try {
        let result = smcat.render(code, {
            inputType: 'smcat',
            outputType: 'svg'
        })
        return `<div class="smcat">${result}</div>`
    } catch (e) {
        return `<pre>${code}</pre>`
    }
}
