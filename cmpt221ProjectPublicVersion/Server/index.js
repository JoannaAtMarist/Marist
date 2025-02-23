/**
 * Main Server File - Handles routing, middleware, database connection, and server start
 */


/* Constants and Import Modules */
const express = require('express')
const mongoose = require("mongoose");
const path = require('path'); // Required for potential EJS path issues
const bodyParser = require('body-parser'); // Enables parsing of request body
const session = require('express-session'); // Session management

const mainController = require('./controllers/mainController');
const accountController = require('./controllers/accountController');

const app = express()
const port = 3000


/* Middleware */
app.use(bodyParser.json()); // Handles POST, PATCH, or PUT requests with JSON
app.use(express.urlencoded({ extended: true })); // Enables form submission handling
app.use(session({
    secret: 'Secret keyword', // Enables session support
    resave: false,
    saveUninitialized: true,
    cookie: {}
}));
app.use(express.static('Client/public')); // Serves static assets
app.set('view engine', 'ejs'); // Set EJS as the template engine
app.set('views', './Client/views'); // Sets directory for EJS views
//app.set('views', path.join(__dirname, '../client/views')); // Alternative EJS path if needed


/* Database Connection */
mongoose.connect("mongodb://localhost:27017/projectdb", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Connection failed: ', err));

// Additional database event listeners (optional but kept for safety)
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error: "));
db.once("open", () => {
    console.log("Connected to MongoDB");
});


/* Middleware Before Routes */

// Middleware to protect the Members page
function isLoggedIn(req, res, next) {
    if (req.session.user) {
        next(); // User is logged in, proceed to the page
    } else {
        res.redirect('/login'); // Redirect if not logged in
    }
}

// Prevent caching of session-related data
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
});

// Check user session status
app.get('/api/session/status', (req, res) => {
    res.json({ loggedIn: !!req.session.user, user: req.session.user || null });
});


/* Routes to Views */

app.get('/', function (req, res) {
    res.sendFile('index.html', { root: './Client/views' })
})
app.get('/home', function (req, res) {
    res.sendFile('home.html', { root: './Client/views' })
})
app.get('/registration', function (req, res) {
    res.sendFile('registration.html', { root: './Client/views' })
})
app.get('/login', function (req, res) {
    res.sendFile('login.html', { root: './Client/views' })
});
app.get('/profile', (req, res) => {
    console.log('Rendering profile. Views directory:', app.get('views'));
    if (!req.session.user) {
        return res.redirect('/login?message=Please log in to access your profile');
    }
    res.render('profile', { user: req.session.user });
});
app.get('/members', isLoggedIn, (req, res) => {
    res.render('members', { user: req.session.user });
});


/* API Routes */

// Routes for Weather Data
app.route('/api/data') // Route for all data
    .get(mainController.getAllData);
app.route('/api/data/:id') // Route for data by address
    .get(mainController.getDataByZip);

// Routes for Account Management
app.route('/api/accounts') // List all accounts
    .get(accountController.getAllAccounts)
app.route('/api/user') // Create account route
    .post(accountController.createAccount);
app.route('/api/user/login') // Login route
    .post(accountController.login);
app.route('/api/user/logout') // Logout route
    .post(accountController.logout);
app.route('/api/user/:id') // Routes for account operations by _id
    .get(accountController.getAccountInfo) // Get account info
    .patch(accountController.updateAccount) // Update user profile
    .delete(accountController.deleteAccount); // Delete user account
app.patch('/api/user/zip', accountController.updateZipCodePref); // User zip code preference


/* Server Start */
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
