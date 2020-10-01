let abcjsId = 0

let renderer = (code) => {
    abcjsId++
    try {
        let data = JSON.stringify(code)
        return `
<div class="abcjs"><div id="abcjs-${abcjsId}"></div></div>
<script>
ABCJS.renderAbc('abcjs-${abcjsId}', ${data})
</script>
`
    } catch (e) {
        return `<pre>${entities.encodeHTML5(code)}</pre>`
    }
}

renderer.reset = () => {
    abcjsId = 0
}

module.exports = renderer
