// Import required modules
const express = require('express'); // Import Express.js framework
const bodyParser = require('body-parser'); // Middleware to parse request bodies
const path = require('path'); // Utility for working with file and directory paths

// Import custom modules
const mongoConnect = require('./connection/db').mongoConnect; // Custom function to establish MongoDB connection

// Create Express application
const app = express();

// Import route handlers
const noteController = require('./routes/note'); // Import routes for handling notes
const adminRoutes = require('./routes/admin'); // Import routes for admin functionalities

// Set view engine and views directory
app.set('view engine', 'ejs'); // Set EJS as the view engine
app.set('views', 'views'); // Set directory for views

// Middleware: Body parser to parse URL-encoded request bodies
app.use(bodyParser.urlencoded({ extended: false }));

// Middleware: Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware: Route handlers
app.use(noteController); // Use noteController for handling note-related routes
app.use('/admin', adminRoutes); // Use adminRoutes for admin-related routes

// Middleware: 404 error handler
app.use('/', (req, res, next) => {
  res.render('404', {
    pageTitle: 'Page not found',
    path: '',
  });
});

// Connect to MongoDB and start server
mongoConnect(() => {
  app.listen(3000); // Start server on port 3000
});
