module.exports = function (code, meta) {
    if (meta['asciinema-id'] == undefined) {
        meta['asciinema-id'] = 0
    } else {
        meta['asciinema-id'] += 1
    }
    return `<div class="asciinema">\n<asciinema-player id="asciinema-${
        meta['asciinema-id']
    }" src="${code.trim()}"></asciinema-player>\n</div>`
}
