const app = {
    "data": {
        "credentials": {
            username: sessionStorage.username,
            password: sessionStorage.password
        },
        "notes": []
    },
    "basicAuthCreds": function (credentials) {
        return 'Basic ' + btoa(`${credentials.username}:${credentials.password}`)
    },
    "setCredentials": function(username, password){
        this.data.credentials = {
            "username": username,
            "password": password
        }
        sessionStorage.setItem('username',username)
        sessionStorage.setItem('password',password)
    },
    "login": function (username, password){
        fetch('https://notes-api.glitch.me/api/notes', {
            headers:{
                'Authorization': 'Basic '+ btoa(`${username}:${password}`)
            }
        })
        .then(response => {
            if(response.ok) {
                this.setCredentials(username, password)
                this.getNotes()
                this.render()
            }
        })
    },

    "render": function(){
        document.querySelector(".login-container").classList.add('hidden')
        document.querySelector(".main-wrap").classList.remove('hidden')
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
        .then(response => response.json())
        .then(data => {
            for (let note of data.notes){
                this.data.notes.push(note)
            }
            console.log(this.data.notes)
        })
    }
    "main": () => {
        if(app.data.credentials.username){
            app.getNotes()
            app.render()
        }
        let login = document.querySelector(".login")
        login.addEventListener('submit', function(event){
            event.preventDefault()
            let loginData = new FormData(login)
            app.login(loginData.get('username'),loginData.get('password'))
        })
    }
}
app.main()
