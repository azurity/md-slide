let portList = []
onconnect = function(e) {
    let port = e.ports[0]
    portList.push(port)
    port.onmessage = (ev) => {
        switch (ev.data[0]) {
            case 'close':
                portList = portList.filter((val) => val != port)
                break
            default:
                portList.map((p) => {
                    p.postMessage(ev.data)
                })
                break
        }
    }
}
