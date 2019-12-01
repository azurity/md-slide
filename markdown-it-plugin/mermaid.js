const entities = require('entities')

module.exports = function(code) {
    return `<div class="mermaid">${entities.encodeHTML5(code)}</div>`
}
