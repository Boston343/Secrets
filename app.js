//jshint esversion:6
// npm and express includes
import express from "express"; // npm install express
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
// import _ from "lodash";
// import https from "https"; // for forming external get requests

// local includes
// import * as date from "./src/date.js";

dotenv.config(); // gets the .env data for use with process.env.
const app = express();
app.set("view engine", "ejs"); // using EJS
const port = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true })); // this is for parsing data from html form

// __dirname is only available with CJS. Since I am using ESM I need to get it another way
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// static items like other js or css files will not load unless you define where the server should
//      start looking for those files.
app.use(express.static(path.join(__dirname, "/public")));

// -----------------------------------------------------------------------------------
// ------------------------------- Mongoose Setup ------------------------------------
// -----------------------------------------------------------------------------------
// connect to MongoDB - local connection
mongoose.connect("mongodb://localhost:27017/userDB", {
    useNewUrlParser: true,
});
// connect to MongoDB Atlas (the cloud)
// mongoose.connect(
//     "mongodb+srv://" +
//         process.env.MONGODB_USER +
//         ":" +
//         process.env.MONGODB_PASS +
//         "@cluster0.ovomich.mongodb.net/userDB?retryWrites=true&w=majority",
//     {
//         useNewUrlParser: true,
//     }
// );

// schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "ERROR: You need a username."],
    },
    password: {
        type: String,
        required: [true, "ERROR: You need a password"],
    },
});

// model: mongoose will auto make it plural "users"
const User = mongoose.model("User", userSchema);

// -----------------------------------------------------------------------------------
// ---------------------------------- Listening --------------------------------------
// -----------------------------------------------------------------------------------
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

// -----------------------------------------------------------------------------------
// ------------------------------------ Routes ---------------------------------------
// -----------------------------------------------------------------------------------
// homepage
app.route("/").get((req, res) => {
    res.render("home");
});

// -----------------------------------------------------------------------------------
app.route("/register")
    // GET /register will show the register page
    .get((req, res) => {
        res.render("register");
    })

    // POST /register will register a new user
    .post((req, res) => {
        // determine if user already exists
        User.findOne(
            {
                email: {
                    // regex for the entire string (not just part matching), and ignoring case
                    $regex: "^" + req.body.username + "$",
                    $options: "i",
                },
            },
            // findOne callback
            (err, user) => {
                if (err) {
                    console.log(err);
                } else {
                    if (user) {
                        // notify user email exists
                        console.log(
                            "email: " + req.body.username + " already exists."
                        );
                        res.redirect("/");
                    } else {
                        // user does not exist, so create it
                        const newUser = new User({
                            email: req.body.username,
                            password: req.body.password,
                        });

                        // save new user
                        newUser.save((err) => {
                            if (err) {
                                console.log(err);
                                res.redirect("/register");
                            } else {
                                res.redirect("/secrets");
                            }
                        });
                    }
                }
            }
        );
    });

// -----------------------------------------------------------------------------------
app.route("/login")
    // GET /login will show the login page
    .get((req, res) => {
        res.render("login");
    })

    // POST /login will attempt to login the user
    .post((req, res) => {
        const email = req.body.username;
        const password = req.body.password;
    });

// -----------------------------------------------------------------------------------
app.route("/secrets")

    // GET /secrets will show the secrets page
    .get((req, res) => {
        res.render("secrets");
    })
    // POST /secrets creates a new secret
    .post((req, res) => {});
