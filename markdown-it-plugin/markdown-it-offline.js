function Offline(md, opt) {
    let option = new Set()
    if (opt instanceof Set) {
        option = opt
    }
    md.core.ruler.after('inline', 'offline', function (state) {
        if (state.env.offline) {
            state.tokens.forEach(function (blockToken) {
                if (blockToken.type === 'inline' && blockToken.children) {
                    blockToken.children.forEach(function (token) {
                        if (token.type === 'image') {
                            token.attrs.forEach(function (attr) {
                                if (attr[0] === 'src') {
                                    let localName = `resource/${state.env.resourceIndex}`
                                    state.env.offlineResource.push([
                                        localName,
                                        attr[1],
                                    ])
                                    attr[1] = localName
                                    state.env.resourceIndex++
                                }
                            })
                        }
                    })
                }
            })
        }
    })
}

module.exports = Offline
