const entities = require('entities')

let artPlayerId = 0

let renderer = (code, env) => {
    artPlayerId++

    try {
        let data = JSON.parse(code)
        data.container = `#artPlayer-${artPlayerId}`
        data.layers = undefined
        let width = parseInt(data.width)
        let height = parseInt(data.height)
        return `
<div class="artPlayer"><div style="width:${
            width ? `${width}px` : '100%'
        };height:${
            height ? `${height}px` : '100%'
        };" id="artPlayer-${artPlayerId}"></div></div>
<script>
if(window.artPlayerMap === undefined) window.artPlayerMap = new Map();
window.artPlayerMap.set('artPlayer-${artPlayerId}', new Artplayer(${JSON.stringify(
            data
        )}));
</script>
`
    } catch (e) {
        return `<pre>${entities.encodeHTML5(code)}</pre>`
    }
}

renderer.reset = () => {
    artPlayerId = 0
}

module.exports = renderer
