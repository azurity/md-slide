const session = require('express-session')

function Init(app, config) {
    const option = Object.assign(
        { resave: false, saveUninitialized: false, secret: 'md-slide' },
        config.options
    )
    if (config.store != undefined) {
        try {
            let store = require(config.store.module)(session)
            option.store = new store(config.store.options)
        } catch (e) {
            console.log(e.toString())
        }
    }
    app.use(session(option))
}

module.exports = Init
