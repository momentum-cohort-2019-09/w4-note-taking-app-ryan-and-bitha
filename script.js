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
            }
        })
    },

    "render": function(){

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
