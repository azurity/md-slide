const entities = require('entities')
let timesheetId = 0

let renderer = (code) => {
    timesheetId++
    try {
        let data = JSON.parse(code)
        if (
            typeof data.from != 'number' ||
            typeof data.to != 'number' ||
            !(data.list instanceof Array)
        ) {
            throw ''
        }
        return `
<div id="timesheet-${timesheetId}"></div>
<script>
new Timesheet('timesheet-${timesheetId}', ${data.from}, ${data.to}, ${JSON.stringify(data.list)})
</script>
`
    } catch (e) {
        return `<pre>${entities.encodeHTML5(code)}</pre>`
    }
}

renderer.reset = () => {
    timesheetId = 0
}

module.exports = renderer
