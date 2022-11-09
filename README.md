# Secrets

Authentication and Security Examples. This uses Passport, Mongoose, Express-Session, and EJS.

Homepage is at https://reap3r-secrets.glitch.me/. You can register and then login to view the secrets! Password is salted and hashed using passport and passport-local-mongoose, before being stored in MongoDB. If you log in with Google or Facebook then your password is not stored as it uses 0Auth. Logged in users can create new secrets which will be displayed for all at https://reap3r-secrets.glitch.me/secrets.

Sessions are created using express-session for login / logout usage. There are some alerts for various errors a user may encounter, such as an account already having been created, and for an incorrect password.

## Features

- Passport
  - Passwords are salted and hashed before being stored in user database
  - login, and logout implemented with express-session
  - Google 0Auth 2.0 implemented using passport-google-oauth20
- Mongoose
  - Connecting to MongoDB Atlas, as well as local (commented out)
  - CRUD operations
- EJS - Data retreival and manipulation
  - Serving up HTML files with input from server
  - Retreive data from form, manipulate, and respond to user with updated html file
  - EJS layouts and running code inside `.ejs` files so we don't have to have a ton of html files
- 0Auth Logins
  - Google login (currently only works with a few test users)
  - Facebook login (currently only works with a few test users)

## Dependencies

- Node modules - inside project run `npm install`
  - express
  - express-session
  - ejs
  - mongoose
  - mongoose-findorcreate
  - passport
  - passport-local
  - passport-local-mongoose
  - passport-google-oauth20
  - passport-facebook
  - dotenv
  - lodash
  
### For running on localhost...
- MongoDB installed. You will need to install the free community server, as well as mongo shell
  - Installation files:
    - https://www.mongodb.com/try/download/community
    - https://www.mongodb.com/try/download/shell
  - You will then need to add both to your "PATH" environment variable
  - You can then start your local MongoDB with the command "mongod", and the shell can be accessed with command "mongosh"
- Studio 3T
  - Optional, but it is a nice GUI for viewing MongoDB databases
- Google 0Auth 2.0
  - Authentication / login using Google login
    - Requires you to have a Project created in the [Google Developers Console](https://console.developers.google.com/)
- Facebook 0Austin
  - Authentication / login using Facebook login
    - Requires you to have an App created in the [Facebook Developer Console](https://developers.facebook.com/)

## Dev Dependencies

- eslint
  - [ESLint Getting Started Guide](https://eslint.org/docs/latest/user-guide/getting-started)
