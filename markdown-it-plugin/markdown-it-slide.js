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
                let m = line.match(/^::(image|video)\((.+)\)\s*$/)
                if (!!m) {
                    try {
                        new URL(m[2])
                        background = m
                        state.line++
                    } catch (e) {}
                }
                // close tag
                if (!!state.env['slides-close']) {
                    for (let token of state.env['slides-close']) {
                        state.tokens.push(token)
                    }
                }
                let closeToken = []
                // section
                let section = new Token('slide_open', 'section', 1)
                section.attrSet('class', [attr.class].join(' ').trim())
                state.tokens.push(section)
                let token = new Token('slide_close', 'section', -1)
                token.block = true
                closeToken = [token]
                // wrap
                let wrap = new Token('slide_wrap_open', 'div', 1)
                wrap.attrSet(
                    'class',
                    ['wrap', 'align' + attr.align, attr.wrap].join(' ').trim()
                )
                wrap.block = true
                state.tokens.push(wrap)
                state.env['slides-close'] = [
                    new Token('slide_blank_open', 'div', 1),
                    new Token('slide_blank_close', 'div', -1),
                    new Token('slide_wrap_close', 'div', -1),
                    ...closeToken
                ]
                // background
                if (background !== null) {
                    if(state.env.offline) {
                        let localName = `resource/${state.env.resourceIndex}`
                        state.env.offlineResource.push([
                            localName,
                            background[2],
                        ])
                        background[2] = localName
                        state.env.resourceIndex++
                    }
                    switch (background[1].toString()) {
                        case 'image':
                            {
                                let back = new Token(
                                    'background_open',
                                    'div',
                                    1
                                )
                                back.attrSet('class', 'background')
                                back.attrSet(
                                    'style',
                                    `background-image:url(${background[2]});`
                                )
                                state.tokens.push(back)
                                state.tokens.push(
                                    new Token('background_close', 'div', -1)
                                )
                            }
                            break
                        case 'video':
                            {
                                let back = new Token(
                                    'background_open',
                                    'video',
                                    1
                                )
                                back.attrSet('class', 'background-video')
                                back.attrSet('autoplay', true)
                                back.attrSet('muted', true)
                                back.attrSet('loop', true)
                                state.tokens.push(back)
                                let source = new Token('source', 'source', 0)
                                let type = background[2].toString().split('.')
                                source.attrSet(
                                    'type',
                                    `video/${type[type.length - 1]}`
                                )
                                source.attrSet('src', background[2].toString())
                                state.tokens.push(source)
                                state.tokens.push(
                                    new Token('background_close', 'video', -1)
                                )
                            }
                            break
                        default:
                            break
                    }
                }
                return true
            } else {
                return false
            }
        } catch (e) {
            return false
        }
    })
    md.core.ruler.push('slides-article', function(state) {
        let styleConfig = { 'auto-invert': true }
        if (state.md.meta) {
            styleConfig = Object.assign(
                styleConfig,
                state.md.meta['style-config']
            )
        }
        if (!!state.env['slides-close']) {
            for (let token of state.env['slides-close']) {
                state.tokens.push(token)
            }
            state.env['slides-close'] = []
        }
        let openTag = new Token('article_open', 'article', 1)
        openTag.attrSet('id', 'webslides')
        if (styleConfig['auto-invert']) {
            openTag.attrSet('class', 'invert')
        }
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
            let url = md.meta['highlight-theme']
            if(state.env.offline) {
                let localName = `resource/${state.env.resourceIndex}.css`
                state.env.offlineResource.push([
                    localName,
                    url,
                ])
                url = localName
                state.env.resourceIndex++
            }
            highlightTheme.attrSet('href', url)
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
