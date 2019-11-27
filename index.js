const express = require('express')
const path = require('path')

global.ConfigDir = path.resolve('configs')
global.renderEnv = { home: { scripts: [] } }
global.slidePath = path.resolve(__dirname, 'slides')

const ContentServer = require('./content-server')
const InitServerPlugin = require('./server-plugin/index')

let container = new Map()
let contentServer = new ContentServer(container)

let app = express()
app.set('engine', 'ejs')
app.set('views', 'views')
InitServerPlugin(app)
app.use('/slide', contentServer.server)
app.use('/public', express.static('public'))
for (let p of contentServer.pluginFiles) {
    app.use(`/${p[0]}`, express.static(p[1]))
}
app.get('/list', (req, res) => {
    res.json(contentServer.info())
})
app.get('/', (req, res) => {
    res.render('home.ejs', global.renderEnv['home'])
})

app.listen(80)
