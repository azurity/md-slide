const entities = require('entities')

module.exports = function(code) {
    return `<div class="css-doodle"><css-doodle style="top:0;">\n${entities.encodeHTML5(code)}\n</css-doodle></div>`
}
