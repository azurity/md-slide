const fs = require('fs')
const chokidar = require('chokidar')
const parser = require('./md-parser')

const defaultMeta = {
    title: 'no name slide',
    author: 'unknown'
}

class Provider {
    constructor(path) {
        this.path = path
        this.article = ''
        this.watcher = chokidar.watch(this.path)
        this.watcher.on('all', (event, path) => {
            if (event == 'change') {
                this.renew()
            } else if (event == 'unlink') {
                this.release()
            }
        })
        this.renew()
    }

    release() {
        this.watcher.close()
    }

    async renew() {
        try {
            this.raw = await new Promise((resolve, reject) => {
                fs.readFile(this.path, { encoding: 'utf8' }, (err, data) => {
                    if (err) reject(err)
                    resolve(data)
                })
            })
            parser.renderReset()
            this.article = parser.render(this.raw)
            this.meta = Object.assign(
                Object.assign({}, defaultMeta),
                parser.meta
            )
        } catch (e) {
            console.log(e.toString())
        }
    }

    get() {
        return this.article
    }
}

Provider.env = {
    style: (parser['style-url'] || [])
        .map(
            (url) =>
                `<link rel="stylesheet" type="text/css" media="all" href="${url}">`
        )
        .join('\n'),
    script: (parser['script-url'] || [])
        .map((url) => `<script src="${url}"></script>`)
        .join('\n')
}
Provider.pluginFiles = parser.staticPaths

module.exports = Provider
