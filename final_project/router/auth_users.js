const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let filtered_users = users.filter(user => (user['username'] === username))
    if (filtered_users.length > 0) {
        return false
    } else {
        return true
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let filtered_users = users.filter(user => (user['username'] === username && user['password'] === password))
    if (filtered_users.length > 0) {
        return true
    } else {
        return false
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username
    const password = req.body.password
    if (!username || !password) {
        return res.status(404).json({message: "Unable to login, check username and password"});
    }
    if (authenticatedUser(username, password)) {
        const accessToken = jwt.sign({data : password}, 'access', {expiresIn : 60 * 60})
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).json({message : "User successfully logged in."})
    } else {
        return res.status(404).json({message : "Invalid username or password."})
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = req.params.isbn
    const review = req.query.review
    const username = req.session.authorization['username']
    if (books[isbn]) {
        books[isbn].reviews[username] = review
        return res.status(200).json({message : "Review successfully added"})
    } else {
        return res.status(404).json({message : `Book with ISBN ${isbn} not found`})
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn
    const username = req.session.authorization['username']
    if (books[isbn] && books[isbn]['reviews'][username]) {
        delete books[isbn]['reviews'][username]
    }
    return res.status(200).json({message : "Review successfully deleted."})
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
