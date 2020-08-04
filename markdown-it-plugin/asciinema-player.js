let asciinemaId = 0

let renderer = (code) => {
    asciinemaId++
    return `<div class="asciinema">\n<asciinema-player id="asciinema-${asciinemaId}" src="${code.trim()}"></asciinema-player>\n</div>`
}

renderer.reset = () => {
    asciinemaId = 0
}

module.exports = renderer
