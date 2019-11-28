// this is an example, for how to add login button
window.addEventListener(
    'load',
    async () => {
        try {
            let res = await fetch('/oauth2/name', { cache: 'no-cache' })
            let data = await res.json()
            if (!!data && !!data.name) {
                window.oauth2 = { name: data.name }
                let oauthNode = document.createElement('div')
                oauthNode.innerText = window.oauth2.name
                document.querySelector('#refresh').before(oauthNode)
                return
            }
        } catch (e) {}
        let oauthNode = document.createElement('div')
        oauthNode.className = 'icon-btn dark'
        oauthNode.innerHTML = `<i class="fab fa-github"></i>`
        oauthNode.onclick = () => {
            window.location.href = `/connect/github`
        }
        document.querySelector('#refresh').before(oauthNode)
    },
    { once: true }
)
