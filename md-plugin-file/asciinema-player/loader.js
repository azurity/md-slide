window.addEventListener('load', () => {
    if (query.get('mode') == 'speaker') {
        for (let player of document.getElementsByTagName('asciinema-player')) {
            player.addEventListener('play', () => {
                window.slideWorker.port.postMessage(['asciinemaPlay', player.id])
                console.log('play')
            })
            player.addEventListener('pause', () => {
                window.slideWorker.port.postMessage(['asciinemaPause', player.id])
                console.log('pause')
            })
        }
    }
})
