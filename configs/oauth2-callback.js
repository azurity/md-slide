const fetch = require('node-fetch').default

// this is an exmaple, for how to write a midware to get user info
module.exports = {
    github: async (access_token) => {
        let res = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers: {
                Authorization: `token ${access_token}`
            },
            body: JSON.stringify({
                query: `query{
                    viewer {
                        login
                    }
                }`,
                variables: {}
            })
        })
        let data = await res.json()
        return data.data.viewer.login
    }
}
