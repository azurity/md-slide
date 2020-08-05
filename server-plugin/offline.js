function Init(app, config) {
    global.renderEnv['home'].scripts.push(
        `<script>const offlineResourceURL = ${JSON.stringify(
            config.options
        )}</script>` +
            '<script src="https://cdn.jsdelivr.net/npm/jszip@3/dist/jszip.min.js"></script>\n' +
            '<script src="https://cdn.jsdelivr.net/npm/file-saver@2.0.2/dist/FileSaver.min.js"></script>' +
            '<script src="/public/js/offline.js"></script>'
    )
}

global.renderEnv['home'].scripts.push(
    `<link rel="stylesheet" href="/public/css/offline.css">`
)

module.exports = Init
