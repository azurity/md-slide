window.addEventListener('load', () => {
    if (query.mode == 'speaker') {
        for (let player of document.getElementsByTagName('asciinema-player')) {
            player.addEventListener('play', () => {
                window.slideWorker.port.postMessage(['play', player.id])
                console.log('play')
            })
            player.addEventListener('pause', () => {
                window.slideWorker.port.postMessage(['pause', player.id])
                console.log('pause')
            })
        }
    }
})
