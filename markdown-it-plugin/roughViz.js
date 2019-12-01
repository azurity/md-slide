const entities = require('entities')

let roughVizId = 0

let renderer = (code) => {
    roughVizId++
    try {
        let data = JSON.parse(code)
        if (typeof data.type != 'string') {
            throw ''
        }
        let renderData = Object.assign({}, data)
        renderData.type = undefined
        renderData.element = `#roughViz-${roughVizId}`
        return `
<div id="roughViz-${roughVizId}"></div>
<script>
new roughViz.${data.type}(JSON.parse(unescape(atob('${Buffer.from(
            escape(JSON.stringify(renderData)),
            'utf-8'
        ).toString('base64')}'))))
</script>
`
    } catch (e) {
        return `<pre>${entities.encodeHTML5(code)}</pre>`
    }
}

renderer.reset = () => {
    roughVizId = 0
}

module.exports = renderer
