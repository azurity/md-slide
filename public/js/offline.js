window.addEventListener(
    'load',
    async () => {
        let offlne = async (uuid, os) => {
            try {
                let data = await Promise.all([
                    fetch(`/slide/${uuid}/offline.json`).then((res) => {
                        if (!res.ok) {
                            throw res.statusText
                        }
                        return res.json()
                    }),
                    fetch(offlineResourceURL.launcher[os])
                        .then((res) => {
                            // launcher
                            if (!res.ok) {
                                throw res.statusText
                            }
                            return res.blob()
                        })
                        .then(JSZip.loadAsync),
                    fetch(offlineResourceURL.resource)
                        .then((res) => {
                            // pre-zip
                            if (!res.ok) {
                                throw res.statusText
                            }
                            return res.blob()
                        })
                        .then(JSZip.loadAsync),
                ]).catch((err) => {
                    throw err
                })
                let info = data[0]
                let launcher = await data[1].file('launcher').async('blob')
                let zip = data[2]
                zip.file(
                    `slide/${uuid}/index.md`,
                    fetch(`/slide/${uuid}/index.md`).then((res) => {
                        if (!res.ok) {
                            throw res.statusText
                        }
                        return res.text()
                    })
                )
                info.resource.forEach((resource) => {
                    zip.file(
                        `slide/${uuid}/` + resource[0],
                        fetch(
                            new URL(
                                resource[1],
                                `${window.location.protocol}//${window.location.host}/slide/${uuid}/`
                            ).toString()
                        ).then((res) => {
                            if (!res.ok) {
                                throw res.statusText
                            }
                            return res.blob()
                        }),
                        {
                            binary: true,
                        }
                    )
                })
                zip.file(`slide/${uuid}/index.html`, info.article)
                zip.file('meta.json', JSON.stringify(info.meta))
                let zipData = await zip.generateAsync({ type: 'blob' })
                switch (os) {
                    case 'windows':
                        saveAs(
                            new Blob([launcher, zipData], {
                                type:
                                    'application/vnd.microsoft.portable-executable',
                            }),
                            `slide-${uuid}.exe`
                        )
                        break
                    case 'linux':
                        saveAs(
                            new Blob([launcher, zipData], {
                                type: 'application/x-executable',
                            }),
                            `slide-${uuid}`
                        )
                        break
                    default:
                        alert(`unknown os type: ${os}`)
                }
            } catch (e) {
                console.log(e)
            }
        }
        actionList['offline-windows'] = (ev) => {
            let uuid =
                ev.currentTarget.parentElement.parentElement.parentElement
                    .dataset.uuid
            offlne(uuid, 'windows')
        }
        actionList['offline-linux'] = (ev) => {
            let uuid =
                ev.currentTarget.parentElement.parentElement.parentElement
                    .dataset.uuid
            offlne(uuid, 'linux')
        }
        let btn = document.createElement('div')
        btn.className = 'icon-btn light'
        btn.innerHTML = '<i class="material-icons">save_alt</i>'
        btn.id = 'offline'
        //
        let win = document.createElement('div')
        win.className = 'icon-btn light'
        win.innerHTML = '<i class="fab fa-windows"></i>'
        win.id = 'offline-windows'
        //
        let linux = document.createElement('div')
        linux.className = 'icon-btn light'
        linux.innerHTML = '<i class="fab fa-linux"></i>'
        linux.id = 'offline-linux'
        //
        let content = document.createElement('div')
        content.className = 'offline-content'
        content.append(btn, win, linux)
        document
            .querySelector('#item')
            .content.firstElementChild.querySelector('.action-btn-list')
            .appendChild(content)
        document.querySelectorAll('.action-btn-list').forEach((el) => {
            let node = el.appendChild(content.cloneNode(true))
            node.children[1].onclick = actionList['offline-windows']
            node.children[2].onclick = actionList['offline-linux']
            // el.lastChild.onclick = actionList.delete
        })
    },
    { once: true }
)
