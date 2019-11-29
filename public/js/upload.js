// this is an example, for how to add upload button
window.addEventListener(
    'load',
    function() {
        let uploadInput = document.createElement('input')
        uploadInput.style.display = 'none'
        uploadInput.type = 'file'
        uploadInput.accept = 'text/markdown'
        let upload = document.createElement('div')
        upload.className = 'icon-btn dark'
        upload.innerHTML = `<i class="material-icons">cloud_upload</i>`
        upload.onclick = () => {
            if (!window.oauth2 || !window.oauth2.name) {
                alert('please login first')
                return
            } else {
                uploadInput.click()
            }
        }
        uploadInput.onchange = async (e) => {
            let file = e.target.files[0]
            if (!!file) {
                uploadInput.disabled = true
                try {
                    let res = await fetch('/upload', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            name: file.name,
                            file: await file.text()
                        })
                    })
                    if (res.status != 200) {
                        alert('upload failed or format failed')
                    } else {
                        refresh()
                    }
                } catch (e) {}
                uploadInput.disabled = false
            }
            uploadInput.value = ''
        }
        document.body.append(uploadInput)
        document.querySelector('#refresh').after(upload)
    },
    { once: true }
)
