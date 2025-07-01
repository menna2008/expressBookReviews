const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    const username = req.body.username
    const password = req.body.password
    if (username && password) {
        if (isValid(username)) {
            users.push({"username" : username, "password" : password})
            return res.status(200).json({message: "User successfully registered"});
        } else {
            return res.status(404).json({message: "Username already exists"});
        }
    } else {
        return res.status(404).json({message: "Could not register. Check username and password"});
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books, null, 4))
});

public_users.get('/async', async function(req, res) {
    try {
        const data = await axios.get("http://localhost:5000/")
        res.send(JSON.stringify(data))
    } catch(error) {
        console.error(error)
        return res.status(500).json({message : "Error occured when retrieving data"})
    }
})

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    res.send(books[req.params.isbn])
});

public_users.get('/async/isbn/:isbn', async function(req, res) {
    try {
        const data = await axios.get("http://localhost:5000/")
        res.send(data[req.params.isbn])
    } catch(error) {
        console.error(error)
        return res.status(500).json({message : "Error occured when retrieving the data"})
    }
})
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author
    let filtered_books = Object.entries(books).filter(([index, book]) => book['author'].toLowerCase() === author.toLowerCase())
    res.send(Object.fromEntries(filtered_books))
});

public_users.get('async/author/:author', async function(req, res) {
    try {
        const data = await axios.get("http://localhost:5000/")
        let filtered_books = Object.entries(books).filter(([index, book]) => (book.author === req.params.author))
        res.send(Object.fromEntries(filtered_books))
    } catch(error) {
        console.error(error)
        return res.status(500).json({message : "Error occured when retrieving the data"})
    }
})

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title
    let filtered_books = Object.entries(books).filter(([index, book]) => book['title'].toLowerCase() === title.toLowerCase())
    res.send(Object.fromEntries(filtered_books))
    return res.status(200).json({message: "Yet to be implemented"});
});

public_users.get('async/title/:title', async function(req, res) {
    try {
        const data = await axios.get("http://localhost:5000/")
        let filtered_books = Object.entries(books).filter(([index, book]) => (book.title === req.params.title))
        res.send(Object.fromEntries(filtered_books))
    } catch(error) {
        console.error(error)
        return res.status(500).json({message : "Error occured when retrieving the data"})
    }
})

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    res.send(books[req.params.isbn]['reviews'])
    return res.status(200).json({message: `Reviews for the book with the ISBN ${req.params.isbn}`});
});

public_users.get('async/review/:isbn', async function(req, res) {
    try {
        const data = await axios.get("http://localhost:5000/")
        res.send(data[req.params.isbn]['reviews'])
    } catch(error) {
        console.error(error)
        return res.status(500).json({message : "Error occured when retrieving the data"})
    }
})

module.exports.general = public_users;
