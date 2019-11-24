const It = require('markdown-it')
const hljs = require('highlight.js')
const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const config = yaml.load(
    fs.readFileSync('module.config.yaml', { encoding: 'utf8' })
)

let renderFunction = {}

let it = It({
    highlight: function(str, lang) {
        if (lang) {
            let renderMatch = lang.match(/^render\((.+)\)/)
            if (!!renderMatch && !!renderFunction[renderMatch[1]]) {
                return `<pre class="render"></pre>${renderFunction[
                    renderMatch[1]
                ](str)}<pre class="render"></pre>`
            }
            if (hljs.getLanguage(lang)) {
                try {
                    return `<pre class="hljs"><code class="hljs language-${lang}">${
                        hljs.highlight(lang, str).value
                    }</code></pre>`
                } catch (__) {}
            }
        }
        return `<pre class="hljs"><code>${it.utils.escapeHtml(
            str
        )}</code></pre>`
    }
})
it.staticPaths = []
it['style-url'] = []
it['script-url'] = []

for (let c of config) {
    if (!!c.module) {
        if (c.type === 'render') {
            renderFunction[c.name] = require(c.module)
        } else {
            it.use(require(c.module))
        }
    }
    if (!!c.static && c.static.length != 0) {
        for (let s of c.static) {
            if (fs.existsSync(path.resolve('md-plugin-file', s))) {
                it.staticPaths.push([s, path.resolve('md-plugin-file', s)])
            }
        }
    }
    it['style-url'].push(...(c['style-url'] || []))
    it['script-url'].push(...(c['script-url'] || []))
}

it.renderReset = () => {
    for (let f in renderFunction) {
        if (typeof renderFunction[f].reset === 'function') {
            renderFunction[f].reset()
        }
    }
}

module.exports = it
