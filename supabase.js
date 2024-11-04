const { createClient } = require('@supabase/supabase-js')
const dotenv = require('dotenv')
dotenv.config()

const supabase = createClient(process.env.SUPABASE_DOMAIN, process.env.SUPABASE_PUBLIC_KEY)

// getStudyResources() gets study resources from database

async function getStudyResources() {
    const {data, error} = await supabase.from('studyResources').select('*')
    if (error) {
        console.log(error)
    } else {
        return data
    }
}

// Login() function with username and password

async function login(username_, password_) {
    const {data, error} = await supabase.auth.signInWithPassword({
        username: username_,
        password: password_,
    })
    if (error) {
        console.log(error)
    } else {
        console.log(data)
    }
}

// Logout() function
async function logout() {
    const {error} = await supabase.auth.signOut()
    if (error) {
        console.log(error)
    }
}

// Export functions to main.js
module.exports = {getStudyResources, login, logout}