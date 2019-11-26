const express = require('express')
const path = require('path')

global.ConfigDir = path.resolve('configs')

const ContentServer = require('./content-server')

let container = new Map()
let contentServer = new ContentServer(container)

let app = express()
app.set('engine', 'ejs')
app.set('views', 'views')
app.use('/slide', contentServer.server)
app.use('/public', express.static('public'))
for (let p of contentServer.pluginFiles) {
    app.use(`/${p[0]}`, express.static(p[1]))
}
app.get('/list', (req, res) => {
    res.json(contentServer.info())
})
app.get('/', (req, res) => {
    res.render('home.ejs')
})

app.listen(80)
