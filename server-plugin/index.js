const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const config = yaml.load(
    fs.readFileSync(path.resolve(global.ConfigDir, 'server.module.yaml'), {
        encoding: 'utf8'
    })
)

function InitServerPlugins(app) {
    config.map((conf) => {
        try {
            require(conf.module)(app, conf)
        } catch (e) {
            console.log(e.toString())
        }
    })
}

module.exports = InitServerPlugins
