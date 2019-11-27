const express = require('express')
const fs = require('fs')
const chokidar = require('chokidar')
const path = require('path')
const MDProvider = require('./md-provider')

class ContentServer {
    constructor(container) {
        this.container = container
        this.pluginFiles = MDProvider.pluginFiles
        this.basePath = global.slidePath
        this.init()
        this.createServer()
    }

    createServer() {
        const router = express.Router()
        router.use('/:uuid', (req, res, next) => {
            if (!this.container.has(req.params.uuid)) {
                res.sendStatus(404)
            } else {
                if (req.path == '/') {
                    res.render(
                        'index.ejs',
                        Object.assign(
                            {
                                content: this.container
                                    .get(req.params.uuid)
                                    .provider.get(),
                                params: JSON.stringify(req.query),
                                config: JSON.stringify(
                                    this.container.get(req.params.uuid).provider
                                        .meta.config
                                ),
                                uuid: JSON.stringify(req.params.uuid)
                            },
                            MDProvider.env
                        )
                    )
                } else if (req.path == '/index.md') {
                    res.set('Content-Type', 'text/markdown; charset=UTF-8')
                    res.send(this.container.get(req.params.uuid).provider.raw)
                } else {
                    this.container.get(req.params.uuid).router(req, res, next)
                }
            }
        })
        this.server = router
    }

    async slideLoad(file) {
        let isFile = await new Promise((resolve, reject) => {
            fs.stat(path.resolve(this.basePath, file), (err, stats) => {
                if (!err) {
                    resolve(stats.isFile())
                } else {
                    return null
                }
            })
        })
        if (isFile == null) return null
        if (isFile) {
            if (path.extname(file) !== '.md') return null
            return [
                file.split('.')[0],
                {
                    router: express.Router(),
                    provider: new MDProvider(path.resolve(this.basePath, file))
                }
            ]
        } else {
            let indexPath = path.resolve(this.basePath, file, 'index.md')
            try {
                if (
                    !fs.existsSync(indexPath) ||
                    !fs.statSync(indexPath).isFile()
                ) {
                    return null
                }
            } catch (e) {
                return null
            }
            return [
                file,
                {
                    router: express.static(
                        path.resolve(this.basePath, file, 'public')
                    ),
                    provider: new MDProvider(indexPath)
                }
            ]
        }
    }

    init() {
        this.watcher = chokidar.watch(this.basePath)
        this.watcher
            .on('add', async (filePath, stats) => {
                if (this.basePath == path.dirname(filePath)) {
                    let slide = await this.slideLoad(path.basename(filePath))
                    if (slide != null) {
                        this.container.set(slide[0], slide[1])
                    }
                }
            })
            .on('addDir', async (dirPath, stats) => {
                if (this.basePath == path.dirname(dirPath)) {
                    let slide = await this.slideLoad(path.basename(dirPath))
                    if (slide != null) {
                        this.container.set(slide[0], slide[1])
                    }
                }
            })
            .on('unlink', async (filePath, stats) => {
                if (this.basePath == path.dirname(filePath)) {
                    this.container.delete(path.basename(filePath).split('.')[0])
                }
            })
            .on('unlinkDir', async (dirPath, stats) => {
                if (this.basePath == path.dirname(dirPath)) {
                    this.container.delete(path.basename(dirPath))
                }
            })
    }

    info() {
        let result = []
        for (let key of this.container.keys()) {
            result.push([key, this.container.get(key).provider.meta])
        }
        return result
    }
}

module.exports = ContentServer
