// loading environment variables
require('dotenv').config();

// import express package
const express = require('express');

// import jsonwebtoken for authorisation
const jwt = require('jsonwebtoken');

// instantiate express application
const app = express();

// use express body parser middleware
app.use(express.json());

// initialise our posts dataset
const posts = [
    {
        username: 'John',
        title: 'post 1'
    },
    {
        username: 'Gina',
        title: 'post 2'
    }
];

// create a simple route to get all our posts
/**
 * @method: GET
 * @description: get posts of the logged user
 * @access: Private
 */
app.get('/posts', authoriseToken, (req, res) => {
    res.json(posts.filter(post => post.username === req.user.name));
});

// create a login route
/**
 * @method: POST
 * @description: login
 * @access: Public
 */
app.post('/login', (req, res) => {
    // 1- Authentication : e.g. 'passport js'
    // 2- Authorisation : JWT, 
    //   create a token to access APIs you're authorised to
    const username = req.body.username;
    const user = {
        name: username
    };
    const accessToken = jwt.sign(user, process.env.ACCESS_SECRET);
    res.json({
        accessToken
    });
});

//
function authoriseToken(req, res, next) {
    // access the request headers to look for the token
    const authHeader = req.headers['authorization'];
    // req.headers['authorization] : "Bearer 'jhbfvejsfbweiube'"
    const token = authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401); // no token

    // As we're here, means we have a token, we need to verify it :
    jwt.verify(token, process.env.ACCESS_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Forbidden
        req.user = user;
        next();
    })
}

// listen to port number: 3000
const PORT = process.env.SERVER_PORT;
app.listen(
    PORT, 
    () => { 
        console.log(`Application is connected and listening to port ${PORT}`);
    }
);

