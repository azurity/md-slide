const parser = require('body-parser')
const grant = require('grant-express')
const path = require('path')

function Init(app, config) {
    const oauth2Callback = require(path.resolve(
        global.ConfigDir,
        'oauth2-callback.js'
    ))
    let options = Object.assign({}, config.options)
    for (let key in config.options) {
        if (!oauth2Callback[key]) {
            config.options[key] = undefined
            continue
        }
        if (!config.options[key].callback) {
            config.options[key].callback = `/connected/${key}`
        }
    }
    app.use(parser.urlencoded({ extended: true }), grant(options))
    app.get('/connected/:provider', (req, res) => {
        oauth2Callback[req.params.provider](req.query.access_token)
            .then((user) => {
                req.session.user = user
                res.redirect('/')
            })
            .catch((err) => {
                res.redirect('/')
            })
    })
    app.get('/oauth2/name', (req, res) => {
        res.json({
            name: req.session.user || ''
        })
    })
}

global.renderEnv['home'].scripts.push(
    `<script src="/public/js/oauth2.js"></script>`
)

module.exports = Init
