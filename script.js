const app = {
    "data": {
        "credentials": {
            username: sessionStorage.username,
            password: sessionStorage.password
        },
        "notes": [],
        "currentEditId": ""
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
                console.log(this.data.notes)
                const noteDiv = document.querySelector('.note-wrapper')
                for (let note of this.data.notes) {
                    noteDiv.innerHTML += `<div class="past-notes"><h4>${note.title}</h4><p>${note.text}</p></div>`

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
            let note = new FormData(form)
            event.preventDefault()
        })
        document.querySelector(".new").addEventListener('click', function (event) {
            event.preventDefault()
            event.target.classList.add('hidden')
            app.showEditForm("new")
        })
    },
    "showEditForm": (type,title,content,tags) => {
        document.querySelector(".note-form").innerHTML = `
        <label for="title">Title</label>
        <input id="title" class="title" name="title" value=${title?title:""}>
        <label for="note-content">Note</label>
        <textarea id="note-content" cols="50" rows="6" class="content" name="content" required
            placeholder="Note Content">${content?content:""}</textarea>
        <label for="tags">Tags</label>
        <input id="tags" class="tags" name="tags" value='${tags?tags.join(", "):""}' placeholder="Put, Tags, Here">
        <button type="submit" value="${type}">Post</button>
        `
    },
    "putOrPost": (form) => {

    },
    "postNote": (form) => {

    },
    "putNote": (form) => {

    },

}
app.main()
