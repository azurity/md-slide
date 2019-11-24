function init() {
    window.ws = new WebSlides(config)
    window.slideWorker = new SharedWorker('/public/js/worker.js')
    window.onbeforeunload = () => {
        window.slideWorker.port.postMessage(['close'])
    }
    if (query.mode == 'speaker') {
        window.ws.el.className = 'with-note'
        window.ws.el.addEventListener('ws:slide-change', (event) => {
            window.slideWorker.port.postMessage([
                'slide',
                uuid,
                event.detail.currentSlide0
            ])
        })
        let displayBtn = document.querySelector('#display-btn')
        displayBtn.style.display = 'block'
        displayBtn.onclick = function() {
            window.open(`/slide/${uuid}#slide=${window.ws.currentSlideI_ + 1}`)
        }
    } else {
        window.slideWorker.port.onmessage = (e) => {
            if (e.data[0] == uuid) {
                window.ws.goToSlide(e.data[1])
            }
        }
    }
}
init()
