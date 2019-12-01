const Token = require('markdown-it/lib/token')
const { xml2js } = require('xml-js')

function Slide(md, opt) {
    const option = Object.assign(
        {
            defaultAttr: { class: '', wrap: '', align: 'center' }
            // defaultStyle: {}
        },
        opt
    )
    md.block.ruler.after('html_block', 'slide-tag', function(state, silent) {
        let line = state.src.substring(
            state.bMarks[state.line],
            state.eMarks[state.line]
        )
        let match = line.match(/^\s*<slide.*\/>\s*$/)
        try {
            if (match) {
                let element = xml2js(match[0], { compact: true })['slide']
                if (element == undefined) return false
                let attr = Object.assign({}, option.defaultAttr)
                Object.assign(attr, element._attributes)
                state.line++
                line = state.src.substring(
                    state.bMarks[state.line],
                    state.eMarks[state.line]
                )
                let background = null
                if (line.match(/^::(\W|$)/)) {
                    background = line.substr(2)
                    state.line++
                }
                // close tag
                if (!!state.env['slides-index']) {
                    state.tokens.push(new Token('slide_wrap_close', 'div', -1))
                    let token = new Token('slide_close', 'section', -1)
                    token.block = true
                    state.tokens.push(token)
                } else {
                    state.env['slides-index'] = 0
                }
                // section
                let section = new Token('slide_open', 'section', 1)
                section.attrSet('class', [attr.class].join(' ').trim())
                state.tokens.push(section)
                // background span
                if (background !== null) {
                    let span = new Token('background_open', 'span', 1)
                    span.attrSet('class', 'background')
                    state.tokens.push(span)
                    let inline = new Token('inline', '', 0)
                    inline.children = []
                    inline.content = background
                    inline.map = [state.line - 1, state.line]
                    state.tokens.push(inline)
                    state.tokens.push(new Token('background_close', 'span', -1))
                }
                // wrap
                let wrap = new Token('slide_wrap_open', 'div', 1)
                wrap.attrSet(
                    'class',
                    ['wrap', 'align' + attr.align, attr.wrap].join(' ').trim()
                )
                wrap.block = true
                state.tokens.push(wrap)
                state.env['slides-index']++
                return true
            } else {
                return false
            }
        } catch (e) {
            return false
        }
    })
    md.core.ruler.push('slides-article', function(state) {
        if (!!state.env['slides-index']) {
            state.tokens.push(new Token('slide_wrap_close', 'div', -1))
            let token = new Token('slide_close', 'section', -1)
            token.block = true
            state.tokens.push(token)
            state.env['slides'] = false
        }
        let openTag = new Token('article_open', 'article', 1)
        openTag.attrSet('id', 'webslides')
        openTag.block = true
        let closeTag = new Token('article_close', 'article', -1)
        closeTag.block = true
        state.tokens = [openTag, ...state.tokens, closeTag]
        if (!!md.meta['highlight-theme']) {
            let highlightTheme = new Token('highlight-theme', 'link', 0)
            // <link rel="stylesheet" type="text/css" media="all" href="${url}">
            highlightTheme.attrSet('rel', 'stylesheet')
            highlightTheme.attrSet('type', 'text/css')
            highlightTheme.attrSet('media', 'all')
            highlightTheme.attrSet('href', md.meta['highlight-theme'])
            highlightTheme.block = true
            state.tokens = [highlightTheme, ...state.tokens]
        }
    })
    // md.core.ruler.after('inline', 'slides-styles', function(state) {
    //     for (let token of state.tokens) {
    //         if (option.defaultStyle[token.type] != undefined) {
    //             token.attrJoin('class', option.defaultStyle[token.type])
    //         }
    //     }
    // })
}

module.exports = Slide
