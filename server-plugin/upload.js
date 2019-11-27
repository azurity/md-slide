const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
const parser = require('../md-parser')

function Init(app, config) {
    app.put('/upload', bodyParser.json(), (req, res) => {
        if (!req.session.user) {
            res.sendStatus(403)
        } else if (
            !!req.body.name &&
            path.extname(req.body.name) &&
            !fs.existsSync(path.resolve(global.slidePath, req.body.name)) &&
            !!req.body.file
        ) {
            try {
                parser.meta = {}
                parser.renderReset()
                parser.render(req.body.file)
                if (parser.meta.author != `@${req.session.user}`) {
                    res.sendStatus(403)
                } else {
                    fs.writeFile(
                        path.resolve(global.slidePath, req.body.name),
                        req.body.file,
                        (err) => {
                            if (err) {
                                res.sendStatus(403)
                            } else {
                                res.sendStatus(200)
                            }
                        }
                    )
                }
            } catch (e) {
                res.sendStatus(403)
            }
        } else {
            res.sendStatus(403)
        }
    })
}

global.renderEnv['home'].scripts.push(
    `<script src="/public/js/upload.js"></script>`
)

module.exports = Init
