// set all modules

const express = require("express");
const path = require("path");
const mysql = require("mysql");
const dotenv = require("dotenv");

// for config with info
dotenv.config({path: './.env'})

// runs Express

const app = express();

// connect to db

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASS,
    database: process.env.DATABASE ,
});

// This uses path to set public directory I think

const publicDirectory = path.join(__dirname, './public')
console.log(__dirname)
app.use(express.static(publicDirectory));

// Parse URL-encoded bodies (as sent by HTML forms) -> make sure you can grab the data from any forms

app.use(express.urlencoded({extended: false }));
// Parse JSON bodies (as sent by API client) -> values from form become JSON
app.use(express.json());

// Configure the application to utilize the Handlebars engine

app.set('view engine', 'hbs');

// log error in terminal if can't connect to MYSQL

db.connect( (error) => {
    if(error) {
        console.log(error)
    } else {
        console.log("MYSQL Connected")
    }
});

// Define routes

app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));


// Starts server on port 5000

app.listen(5000, () => {
    console.log("Server started on localhost:5000");
})