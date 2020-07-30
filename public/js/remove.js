// this is an example, for how to add login button
window.addEventListener(
    'load',
    async () => {
        actionList['delete'] = async (ev) => {
            if (!window.oauth2 || !window.oauth2.name) {
                alert('please login first')
                return
            }
            if (
                ev.currentTarget.parentElement.parentElement.querySelector(
                    '#author'
                ).innerText !== `@${window.oauth2.name}`
            ) {
                alert('you can only remove yourself slides')
                return
            }
            try {
                let res = await fetch(
                    `/remove/${ev.currentTarget.parentElement.parentElement.dataset.uuid}`,
                    {
                        method: 'DELETE'
                    }
                )
                if (res.status != 200) {
                    alert('remove failed or format failed')
                } else {
                    setTimeout(refresh, 500) // wait file delete & already trigger chokidar
                }
            } catch (e) {}
        }
        let btn = document.createElement('div')
        btn.className = 'icon-btn light'
        btn.innerHTML = '<i class="material-icons">delete</i>'
        btn.id = 'delete'
        document
            .querySelector('#item')
            .content.firstElementChild.querySelector('.action-btn-list')
            .appendChild(btn)
        document.querySelectorAll('.action-btn-list').forEach((el) => {
            el.appendChild(btn.cloneNode(true))
            el.lastChild.onclick = actionList.delete
        })
    },
    { once: true }
)
