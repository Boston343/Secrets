//jshint esversion:6
import dotenv from "dotenv";
dotenv.config(); // gets the .env data for use with process.env.
import express from "express"; // npm install express
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import passportLocalMongoose from "passport-local-mongoose";
import GoogleStrategy from "passport-google-oauth20";
import FacebookStrategy from "passport-facebook";
import findOrCreate from "mongoose-findorcreate";

import path from "path";
import { fileURLToPath } from "url";
// import _ from "lodash";
// import https from "https"; // for forming external get requests

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

// setup session for the app
var sess = {
  secret: process.env.SESSION_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: {}, // need unsecure cookies for local testing (http)
};

// if we're in production then use secure cookies (https)
if (app.get("env") === "production") {
  app.set("trust proxy", 1); // trust first proxy
  sess.cookie.secure = true; // server secure cookies
}

// session must be created above authentication setup
app.use(session(sess));

// normal user login stuff
app.use(passport.initialize());
app.use(passport.session());

// -----------------------------------------------------------------------------------
// ------------------------------- Mongoose Setup ------------------------------------
// -----------------------------------------------------------------------------------
// connect to MongoDB - local connection
// mongoose.connect("mongodb://localhost:27017/secretsDB", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   family: 4,
// });
// connect to MongoDB Atlas (the cloud)
mongoose.connect(
  "mongodb+srv://" +
    process.env.MONGODB_USER +
    ":" +
    process.env.MONGODB_PASS +
    "@cluster0.ovomich.mongodb.net/secretsDB?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
  }
);

// schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    // required: [true, "ERROR: You need a username."],
  },
  password: {
    type: String,
    // required: [true, "ERROR: You need a password."],
  },
  googleId: String,
  facebookId: String,
  name: String,
  secrets: [String],
});

// use plugin for hashing and salting passwords, and to save users into DB
userSchema.plugin(passportLocalMongoose);

// user other plugin for a findOrCreate function for mongoose
userSchema.plugin(findOrCreate);

// model: mongoose will auto make it plural "users"
const User = mongoose.model("User", userSchema);

// have passport make use of passport-local-mongoose
passport.use(User.createStrategy());
// passport.serializeUser(User.serializeUser());      // these only work for local users (need username)
// passport.deserializeUser(User.deserializeUser());

// general serialize and deserialize functions that should always work as there will always be user._id
passport.serializeUser(function (user, done) {
  done(null, user._id);
  // if you use Model.username as your idAttribute maybe you'd want
  // done(null, user.username);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

// -----------------------------------------------------------------------------------
// Google 0Auth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://reap3r-secrets.glitch.me/auth/google/secrets",
      // callbackURL: "http://localhost:3000/auth/google/secrets",
      // scope: ["profile", "email"],
      // state: true,
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log(profile);
      User.findOrCreate(
        {
          username: profile._json.email,
          googleId: profile.id,
          name: profile.displayName,
        },
        function (err, user) {
          return cb(err, user);
        }
      );
    }
  )
);

// -----------------------------------------------------------------------------------
// Facebook 0Auth
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "https://reap3r-secrets.glitch.me/auth/facebook/secrets",
      // callbackURL: "http://localhost:3000/auth/facebook/secrets",
      // scope: ["public_profile", "email"],
      // state: true,
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log(profile);
      User.findOrCreate(
        {
          username: profile.email,
          facebookId: profile.id,
          name: profile.displayName,
        },
        function (err, user) {
          return cb(err, user);
        }
      );
    }
  )
);

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
  res.render("home", { alertMsg: "" });
});

// -----------------------------------------------------------------------------------
app
  .route("/register")
  // GET /register will show the register page
  .get((req, res) => {
    res.render("register", { alertMsg: "" });
  })

  // POST /register will register a new user
  .post((req, res) => {
    // make sure email & pass field aren't empty
    if (req.body.username === "") {
      const alertMsg = "Please enter your email.";
      return res.render("register", { alertMsg: alertMsg });
    }
    if (req.body.password === "") {
      const alertMsg = "Please enter a password.";
      return res.render("register", { alertMsg: alertMsg });
    }
    // determine if user already exists
    User.findOne(
      {
        username: {
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
            // notify user that the email already exists
            console.log(
              "username: '" + req.body.username + "' already exists."
            );
            const alertMsg =
              "The user account '" +
              req.body.username +
              "' already exists! Please log in.";
            res.render("home", { alertMsg: alertMsg });
          } else {
            // user does not exist, so create it
            User.register(
              { username: req.body.username },
              req.body.password,
              (err, user) => {
                if (err) {
                  // some sort of error. Let user try again
                  console.log(err);
                  const alertMsg = "There was an error. Please try again.";
                  res.render("register", { alertMsg: alertMsg });
                } else {
                  // user was created, authenticate them and go to secrets page
                  passport.authenticate("local")(req, res, () => {
                    res.redirect("/secrets");
                  });
                }
              }
            );
          }
        }
      }
    );
  });

// -----------------------------------------------------------------------------------
app
  .route("/login")
  // GET /login will show the login page
  .get((req, res) => {
    res.render("login", { alertMsg: "" });
  })

  // POST /login will attempt to login the user
  .post((req, res, next) => {
    passport.authenticate("local", (err, user) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        const alertMsg = "Invalid login credentials. Please try again.";
        return res.render("login", { alertMsg: alertMsg });
      } else {
        // for whatever reason, with this method of authentication, I have to manually log in
        req.login(user, (err) => {
          if (err) {
            return next(err);
          }
          return res.redirect("/secrets");
        });
      }
    })(req, res, next); // this passes those parameters to the passport.authenticate function
  });

// -----------------------------------------------------------------------------------
// Google 0Auth
app
  .route("/auth/google")

  // get profile, and email (email not included with normal profile)
  .get(passport.authenticate("google", { scope: ["profile", "email"] }));

// -----------------------------------------------------------------------------------
app
  .route("/auth/google/secrets")

  .get(
    passport.authenticate("google", { failureRedirect: "/login" }),
    function (req, res) {
      // Successful authentication, redirect secrets.
      res.redirect("/secrets");
    }
  );

// -----------------------------------------------------------------------------------
// Facebook 0Auth
app
  .route("/auth/facebook")

  .get(
    passport.authenticate("facebook", { scope: ["public_profile", "email"] })
  );

// -----------------------------------------------------------------------------------
app
  .route("/auth/facebook/secrets")

  .get(
    passport.authenticate("facebook", { failureRedirect: "/login" }),
    function (req, res) {
      // Successful authentication, redirect secrets.
      res.redirect("/secrets");
    }
  );

// -----------------------------------------------------------------------------------
app
  .route("/secrets")

  // GET /secrets opens the secrets page if the user is authenticated
  .get((req, res) => {
    // make it so this page can't be cached
    res.set(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-stal   e=0, post-check=0, pre-check=0"
    );

    // find all users that have secrets
    //  this checks if secrets[0] has a value, which means the user has a secret
    User.find({ "secrets.0": { $exists: true } }, (err, usersWithSecrets) => {
      if (err) {
        console.log(err);
        return err;
      }
      // this gives us all users that have secrets
      res.render("secrets", { users: usersWithSecrets });
    });
  });

// -----------------------------------------------------------------------------------
app
  .route("/submit")

  // GET /submit opens the submit page for a user to submit a new secret
  .get((req, res) => {
    // if user is authenticated, we display the submit page
    if (req.isAuthenticated()) {
      res.render("submit");
    } else {
      res.redirect("/login");
    }
  })

  // POST /submit adds the new secret to the secrets page
  .post((req, res) => {
    const submittedSecret = req.body.secret;

    // req.user returns user info from DB. Most importantly: user._id
    console.log("User ID: " + req.user._id);
    console.log("User: " + req.user);

    // don't do anything if nothing was input
    if (submittedSecret === "") {
      return res.render("submit");
    }

    // find user and add secret to secrets array
    User.findById(req.user._id, (err, foundUser) => {
      if (err) {
        console.log(err);
        return err;
      }
      // add secret and reload secrets page
      foundUser.secrets.push(submittedSecret);
      foundUser.save();
      res.redirect("/secrets");
    });
  });

// -----------------------------------------------------------------------------------
app
  .route("/logout")

  // GET /logout reloads the homepage
  .get((req, res) => {
    req.logout((err) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/");
      }
    });
  });
