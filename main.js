const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true}));

const {logout, login} = require('./supabase');
const { getStudyResources } = require('./supabase');

app.get('/', (req, res) => {
    res.send('Welcome to StudyMAD!')
})

// Login form
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

app.post('/login/post', async (req, res) => {
    let username = req.body.username
    let password = req.body.password
    try {
        await login(username, password)
        const data = await getStudyResources()
        res.send(data)
    } catch (error) {
        console.log(error)
    }
})

// Logout
app.get('/logout', async (req,res) => {
    try {
        await logout()

        const data = await getStudyResources()
        res.send(data)
    } catch (error) {
        console.log(error)
    }
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
