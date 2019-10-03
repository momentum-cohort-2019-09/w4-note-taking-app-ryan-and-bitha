const app = {
    "data": {
        "credentials": {
            username: 'rbproject',
            password: 'test'
        },
        "notes":[]
    },
    "basicAuthCreds": function(username, password) {
    return 'Basic ' + btoa(`${username}:${password}`)
}
}




let credentials = {
    username: 'rbproject',
    password: 'test'
}


fetch('https://notes-api.glitch.me/api/notes', {
    headers: {
        'Authorization': app.basicAuthCreds(app.data.credentials.username, app.data.credentials.password)
    }
})
    .then(response => response.json())
    .then(data => {
        const pastNotes = document.querySelector('.past-notes')
        console.log(data['notes'][0].text)
        pastNotes.innerText = data['notes'][0].text
    }
    )