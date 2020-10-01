function init() {
    window.ws = new WebSlides(config)
    window.slideWorker = new SharedWorker('/public/js/worker.js')
    window.onbeforeunload = () => {
        window.slideWorker.port.postMessage(['close'])
    }
    if (query.get('mode') == 'speaker') {
        window.ws.el.className = 'with-note'
        window.ws.el.addEventListener('ws:slide-change', (event) => {
            window.slideWorker.port.postMessage([
                'slide',
                uuid,
                event.detail.currentSlide0,
            ])
        })
        let displayBtn = document.querySelector('#display-btn')
        displayBtn.style.display = 'block'
        displayBtn.onclick = function () {
            window.open(`/slide/${uuid}/#slide=${window.ws.currentSlideI_ + 1}`)
        }
    } else {
        window.slideListeners = {
            slide: (args) => {
                if (args[0] == uuid) {
                    window.ws.goToSlide(args[1])
                }
            },
            asciinemaPlay: (id) => {
                let player = document.getElementById(id[0])
                if (player?.play) {
                    player.play()
                }
            },
            asciinemaPause: (id) => {
                let player = document.getElementById(id[0])
                if (player?.pause) {
                    player.pause()
                }
            },
            artplayerPlay: (id) => {
                if(window.artPlayerMap !== undefined)
                {
                    let player = window.artPlayerMap.get(id[0])
                    if(player) {
                        player.play = true
                    }
                }
            },
            artplayerPause: (id) => {
                if(window.artPlayerMap !== undefined)
                {
                    let player = window.artPlayerMap.get(id[0])
                    if(player) {
                        player.pause = true
                    }
                }
            },
        }
        window.slideWorker.port.onmessage = (e) => {
            if (typeof window.slideListeners[e.data[0]] == 'function') {
                window.slideListeners[e.data[0]](e.data.slice(1))
            }
        }
    }
}
init()
