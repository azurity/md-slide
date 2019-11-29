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
new roughViz.${data.type}(${JSON.stringify(renderData)})
</script>
`
    } catch (e) {
        return `<pre>${code}</pre>`
    }
}

renderer.reset = () => {
    roughVizId = 0
}

module.exports = renderer
