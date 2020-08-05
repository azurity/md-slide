const It = require('markdown-it')
const hljs = require('highlight.js')
const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const config = yaml.load(
    fs.readFileSync(path.resolve(global.ConfigDir, 'parser.module.yaml'), {
        encoding: 'utf8',
    })
)
// const unescapeAll = require('markdown-it/common/utils')

let renderFunction = {}

let it = It({
    highlight: function (str, lang, env) {
        if (lang) {
            let renderMatch = lang.match(/^render\((.+)\)/)
            if (!!renderMatch && !!renderFunction[renderMatch[1]]) {
                return `<pre class="render"></pre>${renderFunction[
                    renderMatch[1]
                ](str, env)}<pre class="render"></pre>`
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
    },
})
it.staticPaths = []
it['style-url'] = []
it['script-url'] = []
it['offline-style-url'] = []
it['offline-script-url'] = []


it.renderer.rules.fence = function (tokens, idx, options, env, slf) {
    var token = tokens[idx],
        info = token.info ? it.utils.unescapeAll(token.info).trim() : '',
        langName = '',
        highlighted,
        i,
        tmpAttrs,
        tmpToken

    if (info) {
        langName = info.split(/\s+/g)[0]
    }

    if (options.highlight) {
        highlighted =
            options.highlight(token.content, langName, env) ||
            escapeHtml(token.content)
    } else {
        highlighted = escapeHtml(token.content)
    }

    if (highlighted.indexOf('<pre') === 0) {
        return highlighted + '\n'
    }

    // If language exists, inject class gently, without modifying original token.
    // May be, one day we will add .clone() for token and simplify this part, but
    // now we prefer to keep things local.
    if (info) {
        i = token.attrIndex('class')
        tmpAttrs = token.attrs ? token.attrs.slice() : []

        if (i < 0) {
            tmpAttrs.push(['class', options.langPrefix + langName])
        } else {
            tmpAttrs[i][1] += ' ' + options.langPrefix + langName
        }

        // Fake token just to render attributes
        tmpToken = {
            attrs: tmpAttrs,
        }

        return (
            '<pre><code' +
            slf.renderAttrs(tmpToken) +
            '>' +
            highlighted +
            '</code></pre>\n'
        )
    }

    return (
        '<pre><code' +
        slf.renderAttrs(token) +
        '>' +
        highlighted +
        '</code></pre>\n'
    )
}

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
    it['offline-style-url'].push(...(c['offline-style-url'] || []))
    it['offline-script-url'].push(...(c['offline-script-url'] || []))
}

it.renderReset = () => {
    for (let f in renderFunction) {
        if (typeof renderFunction[f].reset === 'function') {
            renderFunction[f].reset()
        }
    }
}

module.exports = it
