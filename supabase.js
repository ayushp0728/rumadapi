const { createClient } = require('@supabase/supabase-js')
const dotenv = require('dotenv')
dotenv.config()

const supabase = createClient(process.env.SUPABASE_DOMAIN, process.env.SUPABASE_PUBLIC_KEY)

// getStudyResources() gets study resources from database

async function getStudyResources() {
    const {data, error} = await supabase.from('studyResources').select('*')
    console.log(data)
    if (error) {
        console.log(error)
    } else {
        return data
    }
}

async function addStudyResource() {
    let studyResource = {
        subject: subject_,
        title: title_,
        description: description_,
        url: url_
    }
    const {data, error} = await supabase.from('studyResources').insert(studyResource)
    if (error) {
        console.log("could not add resource", error)
    }
}

// Login() function with username and password

async function login(username_, password_) {
    try {
        console.log('Checking if user exists:', username_);

        // check if user exists
        const { data: existingUser, error: searchError } = await supabase
            .from('userData')
            .select('*')
            .eq('username', username_);

        console.log('Existing users found:', existingUser); // Debug log

        // if they exist, make sure not a null issue again
        if (existingUser && existingUser.length > 0) {
            console.log('User already exists - not creating new entry');
            return {
                message: 'User already exists',
                user: existingUser[0]
            };
        }

        //make new user if it doesnt exist
        console.log('No existing user found - creating new user');
        const { data: newUser, error: createError } = await supabase
            .from('userData')
            .insert([
                { 
                    username: username_,
                    password: password_
                }
            ])
            .select();

        if (createError) {
            console.error('Error creating user:', createError);
            throw createError;
        }

        console.log('New user created successfully:', newUser);
        return {
            message: 'New user created',
            user: newUser[0]
        };

    } catch (error) {
        console.error('Error in login function:', error);
        throw error;
    }
}

// Logout() function
async function logout() {
    
}

// Export functions to main.js
module.exports = {getStudyResources, login, logout}