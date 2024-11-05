const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const { logout, login } = require('./supabase');
const { getStudyResources } = require('./supabase');
const { addStudyResource } = require('./supabase');

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
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Login</title>
            <style>
                form {
                    max-width: 300px;
                    margin: 20px auto;
                }
                .form-group {
                    margin-bottom: 15px;
                }
                input {
                    width: 100%;
                    padding: 8px;
                    margin-top: 5px;
                }
                button {
                    padding: 10px 20px;
                    cursor: pointer;
                }
            </style>
        </head>
        <body>
            <h1>Login</h1>
            <form id="loginForm">
                <div class="form-group">
                    <label for="username">Username:</label>
                    <input type="text" id="username" name="username" required>
                </div>
                <div class="form-group">
                    <label for="password">Password:</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <button type="button" onclick="handleLogin()">Login</button>
            </form>

            <script>
            function handleLogin() {
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;
                
                fetch('/login/post', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        username: username, 
                        password: password 
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Store username in localStorage when login is successful
                        localStorage.setItem('currentUser', username);
                        alert('Login successful!');
                        window.location.href = '/study-resources';
                    } else {
                        alert('Login failed: ' + data.error);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Error during login: ' + error);
                });
            }
        </script>
        </body>
        </html>
    `);
});

// Update the login endpoint
app.post('/login/post', async (req, res) => {
    console.log('Received login request:', req.body);  // Debug log

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            error: 'Username and password are required'
        });
    }

    try {
        const data = await login(username, password);
        res.json({
            success: true,
            user: data
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            error: error.message
        });
    }
});

// Add resources page

app.get('/add-resource', async (req, res) => {
    res.sendFile(path.join(__dirname, 'add-resource.html'))
})

app.post('/add-resource/post', async(req, res) => {
    let subject_ = req.body.subject;
    let title_ = req.body.title;
    let description_ = req.body.description;
    let type_ = req.body.type;
    let url_ = req.body.url;
    let created_by_ = req.body.created_by;
    
    try{
        await addStudyResource(subject_, title_, description_, type_, url_, created_by_);
        res.send('Study Resource Added!');
    }catch (error){
        console.log(error);
    }

})

// Add a route for the study resources page (where users are redirected after login)
app.get('/study-resources', async (req, res) => {
    try {
        const resources = await getStudyResources();
        res.send(`
            <h1>Study Resources</h1>
            ${resources.map(resource => `
                <div>
                    <h3>${resource.title || 'Untitled'}</h3>
                    <p>${resource.description || 'No description'}</p>
                    <p>Subject: ${resource.subject || 'N/A'}</p>
                    <a href="${resource.url || '#'}">View Resource</a>
                    <p>Created By: ${resource.created_by || 'N/A'}</p>
                    <hr>
                </div>
            `).join('')}
            <br>
            <button onclick="window.location.href='/logout'">Logout</button>
                
        `);
    } catch (error) {
        res.status(500).send('Error loading study resources: ' + error.message);
    }
});


// Logout
app.get('/logout', async (req, res) => {
    res.redirect('/');
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
