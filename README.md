# Secrets

Authentication and Security Examples. This uses express.js, EJS, and Mongoose.

Homepage is at `localhost:3000`. You can create posts at `localhost:3000/compose` which then populate on the homepage. You can also type in `localhost:/3000/posts/postTitle` where "postTitle" is the title of a post seen on the homepage (created on the compose page), and that post will be rendered alone in the window.

## Dependencies

-   Node modules - inside project run `npm install`
    -   express
    -   ejs
    -   lodash
    -   eslint - if desired for linting
        -   [ESLint Getting Started Guide](https://eslint.org/docs/latest/user-guide/getting-started)
-   MongoDB installed. You will need to install the free community server, as well as mongo shell
    -   Installation files:
        -   https://www.mongodb.com/try/download/community
        -   https://www.mongodb.com/try/download/shell
    -   You will then need to add both to your "PATH" environment variable
    -   You can then start your local MongoDB with the command "mongod", and the shell can be accessed with command "mongosh"

## Includes

-   JS includes
    -   express
    -   ejs
    -   mongoose
    -   lodash
    -   dotenv
    -   eslint - if desired for linting
        -   [ESLint Getting Started Guide](https://eslint.org/docs/latest/user-guide/getting-started)
-   Mongoose
    -   Connecting to MongoDB Atlas, as well as local (commented out)
    -   CRUD operations
-   Express
    -   Using Express routing to dynamically render pages
-   EJS - Data retreival and manipulation
    -   Serving up HTML files with input from server
    -   Retreive data from form, manipulate, and respond to user with updated html file
    -   EJS layouts and running code inside `.ejs` files so we don't have to have a ton of html files
