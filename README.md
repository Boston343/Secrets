# Secrets

Authentication and Security Examples. This uses Passport, Mongoose, Express-Session, and EJS.

Homepage is at `localhost:3000`. You can register and then login to view the secret! Password is salted and hashed using passport and passport-local-mongoose, before being stored in MongoDB. Sessions are created using express-session for login / logout usage. There are some alerts for various errors a user may encounter, such as an account already having been created, and for an incorrect password.

## Dependencies

-   Node modules - inside project run `npm install`
    -   express
    -   express-session
    -   ejs
    -   mongoose
    -   passport
    -   passport-local
    -   passport-local-mongoose
    -   dotenv
    -   lodash 
-   MongoDB installed. You will need to install the free community server, as well as mongo shell
    -   Installation files:
        -   https://www.mongodb.com/try/download/community
        -   https://www.mongodb.com/try/download/shell
    -   You will then need to add both to your "PATH" environment variable
    -   You can then start your local MongoDB with the command "mongod", and the shell can be accessed with command "mongosh"

## Dev Dependencies

-   eslint
    -   [ESLint Getting Started Guide](https://eslint.org/docs/latest/user-guide/getting-started)

## Features

-   Passport
    -   Passwords are salted and hashed before being stored in user database
    -   login, and logout implemented with express-session
-   Mongoose
    -   Connecting to MongoDB Atlas, as well as local (commented out)
    -   CRUD operations
-   EJS - Data retreival and manipulation
    -   Serving up HTML files with input from server
    -   Retreive data from form, manipulate, and respond to user with updated html file
    -   EJS layouts and running code inside `.ejs` files so we don't have to have a ton of html files
