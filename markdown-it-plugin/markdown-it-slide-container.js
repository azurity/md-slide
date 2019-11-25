const Container = require('markdown-it-container')
const fs = require('fs')
const yaml = require('js-yaml')

const specialTag = Object.assign(
    {
        note: 'div',
        grid: 'div',
        column: 'div'
    },
    yaml.load(fs.readFileSync('container-alias.yaml'))
)

function SlideContainer(md) {
    let tags = []
    md.use(Container, 'slide-layout', {
        validate: function(params) {
            return params.match(/^[\w\-]+/)
        },
        render: function(tokens, idx) {
            if (tokens[idx].nesting == 1) {
                let tag = tokens[idx].info.trim().match(/^[\w\-]+/)[0]
                if (!!specialTag[tag]) {
                    tokens[idx].attrJoin('class', tag)
                    tag = specialTag[tag]
                }
                tags.push(tag)
                let attrs = (tokens[idx].attrs || []).map(
                    (val) => `${val[0]}=${JSON.stringify(val[1])}`
                )
                return `<${tag} ${attrs.join(' ')}>\n`
            } else {
                let tag = tags.pop()
                return `</${tag}>\n`
            }
        }
    })
}

module.exports = SlideContainer
