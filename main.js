const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true}));

const {logout, login} = require('./supabase');
const { getStudyResources } = require('./supabase');

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="utf-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <title>Welcome to StudyMAD</title>
            </head>
            <body>
                <h1>Welcome to StudyMAD!</h1>
                <p>Click the button below to go to the login page:</p>
                <button onclick="window.location.href='/login'">Go to Login</button>
            </body>
            </html>
        `)
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
