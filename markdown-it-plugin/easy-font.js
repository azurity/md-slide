const Token = require('markdown-it/lib/token')
const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

let config = yaml.load(
    fs.readFileSync(path.resolve(global.ConfigDir, 'easy-font-alias.yaml'))
)

function EnumTokenFontClass(tokens, fontUsed) {
    for (let token of tokens) {
        let classes = token.attrGet('class')
        if (classes != null) {
            for (let className of classes.split(' ')) {
                let m = className.trim().match(/^font-(.+)$/)
                if (!!m) {
                    fontUsed.add(m[1].toString())
                }
            }
        }
        if (!!token.children) {
            EnumTokenFontClass(token.children, fontUsed)
        }
    }
}

module.exports = function(md) {
    md.core.ruler.push('easy-font', function(state) {
        let fontUsed = new Set()
        EnumTokenFontClass(state.tokens, fontUsed)
        let content = {}
        for (let font of fontUsed.values()) {
            let value = font
            if (!!config[font]) {
                value = config[font]
            }
            content[font] = JSON.stringify(value)
        }
        let token = new Token('fence', 'code', 0)
        token.markup = '```'
        token.info = 'render(easy-font-render)'
        token.block = true
        token.content = yaml.dump(content)
        state.tokens.push(token)
    })
}
