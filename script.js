var moment = require('moment')

const app = {
    "data": {
        "credentials": {
            username: sessionStorage.username,
            password: sessionStorage.password
        },
        "notes": [],
        "currentEditId": "",
        "editType": null
    },
    "basicAuthCreds": function (credentials) {
        return 'Basic ' + btoa(`${credentials.username}:${credentials.password}`)
    },
    "setCredentials": function (username, password) {
        this.data.credentials = {
            "username": username,
            "password": password
        }
        sessionStorage.setItem('username', username)
        sessionStorage.setItem('password', password)
    },
    "login": function (username, password) {
        fetch('https://notes-api.glitch.me/api/notes', {
            headers: {
                'Authorization': 'Basic ' + btoa(`${username}:${password}`)
            }
        })
            .then(response => {
                if (response.ok) {
                    this.setCredentials(username, password)
                    this.getNotes()
                    this.render()
                }
            })
    },
    "render": function () {
        document.querySelector(".login-container").classList.add('hidden')
        document.querySelector(".main-wrap").classList.remove('hidden')
    },
    "getNotes": function () {
        this.data.notes = []
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
                this.displayNotes(app.data.notes)
            })
    },
    "displayNotes": (notes) => {
        const noteDiv = document.querySelector('.note-wrapper')
        noteDiv.innerHTML = ''
        for (let note of notes) {
            noteDiv.innerHTML += `
            <div class="past-notes" data-id="${note._id}">
            <h3>${note.title}</h3>
            <p>${note.text}</p>
            <div class="tags">
            ${app.tagsToHtml(note)}
            </div>
            <div class="buttons">
            <button class="edit" type="button"></button>
            <button class="delete" type="button"></button>
            <p class="updated">Last edited: ${moment(note.updated).format("ddd MMM DD YYYY, h:mm A")}</p>
            </div>
            </div>`
        }
    },
    "tagsToHtml": (note) => {
        let htmlArray = note.tags.map(tag => `<div class="tag">${tag}</div>`)
        return htmlArray.join('\n')
    },
    "deleteNote": (noteId) => {
        document.querySelector(".note-form").innerHTML = ""
        document.querySelector(".new").classList.remove("hidden")
        fetch(`https://notes-api.glitch.me/api/notes/${noteId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': app.basicAuthCreds(app.data.credentials)
            }
        }).then(response => {
            if (response.ok) {
                app.data.notes = app.data.notes.filter(note => note._id !== noteId)
                app.displayNotes(app.data.notes)
            }
        })
    },
    "main": () => {
        if (app.data.credentials.username) {
            app.getNotes()
            app.render()
        }
        let login = document.querySelector(".login")
        login.addEventListener('submit', function (event) {
            event.preventDefault()
            let loginData = new FormData(login)
            app.login(loginData.get('username'), loginData.get('password'))
        })
        let form = document.querySelector(".note-form")
        form.addEventListener('submit', function (event) {
            let noteForm = new FormData(form)
            event.preventDefault()
            app.putOrPost(noteForm)
        })
        document.querySelector(".new").addEventListener('click', function (event) {
            event.preventDefault()
            event.target.classList.add('hidden')
            app.showEditForm("new")
        })
        document.querySelector(".notes").addEventListener('click', function (event) {
            if (event.target.matches(".edit")) {
                app.getNoteIndexAndEdit(event.target.parentElement.parentElement.dataset.id)
            } else if (event.target.matches(".delete")) {
                app.deleteNote(event.target.parentElement.parentElement.dataset.id)
            } else if (event.target.matches(".tag")) {
                app.searchNotes(event.target.textContent)
            }
        })
    },
    "showEditForm": (type, title, content, tags) => {
        app.data.editType = type
        document.querySelector(".note-form").innerHTML = `
            <label for="title">Title</label>
            <input id="title" class="title" name="title" value=${title ? title : ""}>
            <label for="note-content">Note</label>
            <textarea id="note-content" cols="50" rows="6" class="content" name="content" required
                placeholder="Note Content">${content ? content : ""}</textarea>
            <label for="tags">Tags</label>
            <input id="tags-input" class="tags-input" name="tags" value='${tags ? tags.join(", ") : ""}' placeholder="Put, Tags, Here">
            <button class="submit-button type="submit" name="button">Post</button>
            `
    },
    "putOrPost": (noteForm) => {
        let title = noteForm.get('title')
        let text = noteForm.get('content')
        let tags = noteForm.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag !== "")
        if (app.data.editType === "new") {
            app.postNote(title, text, tags)
        } else {
            app.putNote(title, text, tags)
        }
    },
    "postNote": (title, text, tags) => {
        fetch('https://notes-api.glitch.me/api/notes', {
            'method': 'POST',
            'body': JSON.stringify({ 'title': title, 'text': text, 'tags': tags }),
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': app.basicAuthCreds(app.data.credentials)
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw "Something went wrong!"
                } else {
                    return response.json()
                }
            })
            .then(note => {
                app.data.notes.push(note)
                app.displayNotes(app.data.notes)
                document.querySelector(".note-form").innerHTML = ""
                document.querySelector(".new").classList.remove("hidden")
            })
            .catch(error => {
                alert(error)
            })
    },
    "putNote": (title, text, tags) => {
        fetch(`https://notes-api.glitch.me/api/notes/${app.data.currentEditId}`, {
            'method': 'PUT',
            'body': JSON.stringify({ 'title': title, 'text': text, 'tags': tags }),
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': app.basicAuthCreds(app.data.credentials)
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw "Something went wrong!"
                } else {
                    return response.json()
                }
            })
            .then(note => {
                app.data.notes.splice(app.data.editIndex, 1, note)
                app.displayNotes(app.data.notes)
                document.querySelector(".note-form").innerHTML = ""
                document.querySelector(".new").classList.remove("hidden")
            })
            .catch(error => {
                alert(error)
            })
    },
    "getNoteIndexAndEdit": (id) => {
        app.data.currentEditId = id
        for (let i = 0; i < app.data.notes.length; i++) {
            if (app.data.notes[i]._id === id) {
                app.data.editIndex = i
                let note = app.data.notes[i]
                return app.showEditForm("edit", note.title, note.text, note.tags)
            }
        }
    },
    "searchNotes": tag => {
        console.log(tag)
        let searchedNotes = app.data.notes.filter(note => note.tags.includes(tag))
        return app.displayNotes(searchedNotes)
    }
}
app.main()
