let echartsId = 0

let renderer = (code) => {
    echartsId++
    try {
        let data = JSON.parse(code)
        return `
<div class="echarts"><div style="width:100%;height:100%" id="echarts-${echartsId}"></div></div>
<script>
echarts.init(document.getElementById('echarts-${echartsId}')).setOption(${code})
</script>
`
    } catch (e) {
        return `<pre>${code}</pre>`
    }
}

renderer.reset = () => {
    echartsId = 0
}

module.exports = renderer
