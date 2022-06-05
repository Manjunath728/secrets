
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption")

const app = express();



app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");




//Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1/userDB';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: String,
    password: String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] })

const User = new mongoose.model("user", userSchema)

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/login', (req, res) => {
    res.render('login');
});
app.post('/login', (req, res) => {
    const userName = req.body.username
    const password = req.body.password

    User.findOne({ email: userName }, function (err, foundUser) {
        if (err) {
            console.log(err);
        }
        else {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render("secrets")
                }
                else {
                    console.log("wrong pass");
                }
            }

        }
    })
});

app.get('/register', (req, res) => {
    res.render('register');
});
app.post('/register', (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })

    newUser.save(function (err) {
        if (err) {
            console.log("am error");
        }
        else {
            res.render("secrets")
        }
    })
});

app.listen(3000, function () {
    console.log("Server started at port:3000")
}
);