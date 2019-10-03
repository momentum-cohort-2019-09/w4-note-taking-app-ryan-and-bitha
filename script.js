
let credentials = {
    username: 'rbproject',
    password: 'test'
}
function basicAuthCreds(username, password) {
    return 'Basic ' + btoa(`${username}:${password}`)
}

fetch('https://notes-api.glitch.me/api/notes', {
    headers: {
        'Authorization': basicAuthCreds(credentials.username, credentials.password)
    }
})
    .then(response => response.json())
    .then(data => {
        const pastNotes = document.querySelector('.past-notes')
        console.log(data[1])
    }
    )