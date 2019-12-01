const entities = require('entities')

let echartsId = 0

let renderer = (code) => {
    echartsId++
    try {
        let data = JSON.parse(code)
        return `
<div class="echarts"><div style="width:100%;height:100%" id="echarts-${echartsId}"></div></div>
<script>
echarts.init(document.getElementById('echarts-${echartsId}')).setOption(JSON.parse(unescape(atob('${Buffer.from(
            escape(code),
            'utf-8'
        ).toString('base64')}'))))
</script>
`
    } catch (e) {
        return `<pre>${entities.encodeHTML5(code)}</pre>`
    }
}

renderer.reset = () => {
    echartsId = 0
}

module.exports = renderer
