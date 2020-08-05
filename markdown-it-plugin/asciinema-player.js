let asciinemaId = 0

let renderer = (code, env) => {
    asciinemaId++
    let url = encodeURI(code.trim())
    if(env.offline) {
        let localName = `resource/${env.resourceIndex}.cast`
        env.offlineResource.push([localName, url])
        url = localName
        env.resourceIndex++
    }
    return `<div class="asciinema">\n<asciinema-player id="asciinema-${asciinemaId}" src="${url}"></asciinema-player>\n</div>`
}

renderer.reset = () => {
    asciinemaId = 0
}

module.exports = renderer
