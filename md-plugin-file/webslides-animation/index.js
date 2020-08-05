window.addEventListener('load', function() {
    if (window.ws != null) {
        let wsan = new WebSlidesAnimation(window.ws)
        if (query.get('mode') == 'speaker') {
            window.ws.el.addEventListener('ws:slide-go-next-step', () => {
                window.slideWorker.port.postMessage([
                    'slide-go-next-step',
                    uuid
                ])
            })
            window.ws.el.addEventListener('ws:slide-reset', () => {
                window.slideWorker.port.postMessage(['slide-reset', uuid])
            })
        } else {
            window.slideListeners['slide-go-next-step'] = (args) => {
                if (args[0] == uuid && typeof window.ws.goNext == 'function') {
                    ws.goNext()
                }
            }
            window.slideListeners['slide-reset'] = (args) => {
                if (args[0] == uuid && typeof window.ws.goNext == 'function') {
                    wsan.onResetStep()
                }
            }
        }
    }
})
