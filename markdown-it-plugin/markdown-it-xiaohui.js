const Plugin = require('markdown-it-regexp')

module.exports = function fontawesome_plugin(md) {
    md.use(
        Plugin(/\:xiaohui-([\w\-]+)\:/, function (match, utils) {
            return '<i class="fc-icon-' + utils.escape(match[1]) + '"></i>'
        })
    )
}
