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
                for (let note of data.notes) {
                    this.data.notes.push(note)
                }
                console.log(this.data.notes)
                const pastNotes = document.querySelector('.notes')
                for (let note of this.data.notes) {
                    pastNotes.innerHTML = pastNotes.innerHTML + `<div class="past-notes" style="border: thin solid grey"><h4>${note.title}</h4><br>${note.text}</div>`

                }
            })
    }
}

app.getNotes()

// console.log(data['notes'][0].text)
