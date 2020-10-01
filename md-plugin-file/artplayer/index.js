window.addEventListener('load', () => {
    if (query.get('mode') == 'speaker' && window.artPlayerMap !== undefined) {
        for (let key of window.artPlayerMap.keys()) {
            window.artPlayerMap.get(key).muted = true
            window.artPlayerMap.get(key).on('play', () => {
                window.slideWorker.port.postMessage(['artplayerPlay', key])
                console.log('play')
            })
            window.artPlayerMap.get(key).on('pause', () => {
                window.slideWorker.port.postMessage(['artplayerPause', key])
                console.log('pause')
            })
        }
    }
})
