const app = {
    "data": {
        "credentials": {
            username: 'rbproject',
            password: 'test'
        },
        "notes": []
    },
    "basicAuthCreds": function (credentials) {
        return 'Basic ' + btoa(`${credentials.username}:${credentials.password}`)
    },

    "getNotes": function () {
        fetch('https://notes-api.glitch.me/api/notes', {
            headers: {
                'Authorization': this.basicAuthCreds(this.data.credentials)
            }
        })
        .then(response => response.json())
        .then(data => {
            for (let note of data.notes){
                this.data.notes.push(note)
            }
            console.log(this.data.notes)
        })
    }
}

app.getNotes()
