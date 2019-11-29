const fs = require('fs')
const path = require('path')
const parser = require('../md-parser')

function Init(app, config) {
    app.delete('/remove/:uuid', (req, res) => {
        if (!req.session.user) {
            res.sendStatus(403)
        } else if (
            !!req.params.uuid &&
            fs.existsSync(
                path.resolve(global.slidePath, req.params.uuid + '.md')
            )
        ) {
            try {
                parser.meta = {}
                parser.renderReset()
                parser.render(
                    fs.readFileSync(
                        path.resolve(global.slidePath, req.params.uuid + '.md'),
                        { encoding: 'utf8' }
                    )
                )
                if (parser.meta.author != `@${req.session.user}`) {
                    res.sendStatus(403)
                } else {
                    fs.unlink(
                        path.resolve(global.slidePath, req.params.uuid + '.md'),
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
    `<script src="/public/js/remove.js"></script>`
)

module.exports = Init
